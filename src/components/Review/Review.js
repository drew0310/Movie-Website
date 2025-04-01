import React, { useEffect, useState } from 'react';
import './Review.css';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const Review = ({ movie }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [overallRating, setOverallRating] = useState(0);
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [editingReview, setEditingReview] = useState(false);
    const [updatedReview, setUpdatedReview] = useState('');
    const [updatedRating, setUpdatedRating] = useState(0);

    const token = sessionStorage.getItem("cineflix_token");
    const email = sessionStorage.getItem("cineflix_user_email");

    useEffect(() => {
        if (movie && token) {
            axios.get(`https://cineflix-production.up.railway.app/review/getReviews/${movie.title}/${movie.release_date}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const fetchedReviews = res.data.reviews;
                setOverallRating(res.data.overall_rating || 0);
                setReviews(fetchedReviews);

                const userReview = fetchedReviews.find(review => review.created_by.email === email);
                if (userReview) {
                    setUserHasReviewed(true);
                    setUpdatedReview(userReview.review_content);
                    setUpdatedRating(userReview.rating);
                }
            })
            .catch(err => console.error("Failed to fetch reviews:", err));
        }
    }, [movie, token, email]);

    const handleSubmitReview = () => {
        if (!newReview.trim() || rating === 0) {
            alert("Please enter a review and select a star rating.");
            return;
        }

        const reviewData = {
            movie_name: movie.title,
            release_date: movie.release_date,
            review_content: newReview,
            rating: parseFloat(rating)
        };

        axios.post("https://cineflix-production.up.railway.app/review/addReview", reviewData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            alert("Review submitted successfully!");
            
            const newUserReview = { ...reviewData, created_by: { name: "You", email } };

            setReviews([...reviews, newUserReview]);
            setUserHasReviewed(true);
            setNewReview('');
            setRating(0);
        })
        .catch(err => console.error("Failed to add review:", err));
    };

    const handleDeleteReview = () => {
        axios.delete(`https://cineflix-production.up.railway.app/review/deleteReview/${movie.title}/${movie.release_date}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Review deleted successfully!");
            setReviews(reviews.filter(review => review.created_by.email !== email));
            setUserHasReviewed(false);
        })
        .catch(err => console.error("Failed to delete review:", err));
    };

    const handleUpdateReview = () => {
        const updatedData = {
            review_content: updatedReview,
            rating: parseFloat(updatedRating)
        };

        axios.put(`https://cineflix-production.up.railway.app/review/editReview/${movie.title}/${movie.release_date}`, updatedData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        })
        .then(() => {
            alert("Review updated successfully!");
            setReviews(reviews.map(review => 
                review.created_by.email === email ? { ...review, review_content: updatedReview, rating: updatedRating } : review
            ));
            setEditingReview(false);
        })
        .catch(err => console.error("Failed to update review:", err));
    };

    const StarRating = ({ selectedStars, onSelect, editable = false }) => (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span 
                    key={star} 
                    className={star <= selectedStars ? "star filled" : "star"} 
                    onClick={editable ? () => onSelect(star) : undefined}
                >
                    ★
                </span>
            ))}
        </div>
    );

    return (
        <div className="reviews-wrapper">
            <div className="reviews-container">
                <div className="average-rating">
                    <div className="rating-circle">
                        <svg viewBox="0 0 100 100">
                            <circle className="rating-bg" cx="50" cy="50" r="45"></circle>
                            <circle
                                className="rating-progress"
                                cx="50" cy="50"
                                r="45"
                                style={{ strokeDashoffset: 283 - ((overallRating || 0) / 5) * 283 }}
                            ></circle>
                        </svg>
                        <span>{(overallRating || 0).toFixed(1)}</span>
                    </div>
                </div>

                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className={`review-card ${review.created_by.email === email ? "user-review" : ""}`}>
                            {review.created_by.email === email ? (
                                editingReview ? (
                                    <>
                                        <textarea 
                                            className="editable-textarea"
                                            value={updatedReview}
                                            onChange={(e) => setUpdatedReview(e.target.value)}
                                        />
                                        <StarRating selectedStars={updatedRating} onSelect={setUpdatedRating} editable={true} />
                                        <FaX className='close-icon' onClick={() => setEditingReview(false)}></FaX>
                                        <FaCheck className="submit-icon" onClick={handleUpdateReview} />
                                    </>
                                ) : (
                                    <>
                                        <div className="review-actions">
                                            <FaEdit className="edit-icon" onClick={() => setEditingReview(true)} />
                                            <FaTrash className="delete-icon" onClick={handleDeleteReview} />
                                        </div>
                                        <p><strong>You</strong></p>
                                        <p>{review.review_content}</p>
                                        <p className="star-display">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                                    </>
                                )
                            ) : (
                                <>
                                    <p><strong>{review.created_by.name}</strong></p>
                                    <p>{review.review_content}</p>
                                    <p className="star-display">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999", textAlign: "center" }}>No footprints on this red carpet yet — start the buzz!</p>
                )}
            </div>

            {token && !userHasReviewed && (
                <div className="add-review">
                    <h3>Add a Review</h3>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Spill the popcorn! Let us know your thoughts..."
                    ></textarea>
                    <StarRating selectedStars={rating} onSelect={setRating} editable={true} />
                    <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
            )}
        </div>
    );
};

export default Review;











