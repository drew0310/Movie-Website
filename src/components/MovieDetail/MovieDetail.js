import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './MovieDetail.css';
import axios from 'axios';
import Review from '../Review/Review';


const MovieDetail = () => {
  const { state } = useLocation();
  const movie = state?.movie;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieData, setMovieData] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const token = sessionStorage.getItem("cineflix_token");

  useEffect(() => {
    if(movie && token) {
      axios.get(`https://cineflix-production.up.railway.app/movies/details/?movie_url=${movie.url}`, {
        headers: { Authorization: `Bearer ${token}`}
      })
      .then(res => {
        setMovieData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch movie details: ", err);
      });
    }
  }, [movie, token]);

  useEffect(() => {
    if (movieData && movieData.backdrops.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % movieData.backdrops.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [movieData]);

  const fetchTrailer = () => {
    axios.get(`https://cineflix-production.up.railway.app/movies/trailer/${movie.title}${movieData.language}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const youtubeUrl = res.data.trailer_url;
        const videoId = youtubeUrl.split("v=")[1].split("&")[0];
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        setTrailerUrl(embedUrl);
      })
      .catch(err => {
        console.error("Failed to fetch trailer:", err);
      });
  };


  if (!movieData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading movie details...</h2>
      </div>
    );
  }

  return (
    <>
    <div className="movie">
      <div className="movie__intro">
        <div className="slideshow__container">
          <div
            className="slideshow__slider"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.isArray(movieData.backdrops) && movieData.backdrops.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Backdrop ${index}`}
                className="movie__backdrop"
              />
            ))}
          </div>
        </div>
        <div className="movie__overlay" />
      </div>

      <div className="movie__detail">
        <div className="movie__detailLeft">
          <div className="movie__posterBox">
            <img className="movie__poster" src={`https://image.tmdb.org/t/p/original/${movie.poster.split("/").pop()}`} alt="Poster" />
          </div>
        </div>

        <div className="movie__detailRight">
          <div className="movie__detailRightTop">
            <div className="movie__name">{movie.title}</div>
            <div className="movie__runtime">Runtime: {movieData.runtime}</div>
            <div className="movie__releaseDate">Release Date: {movie.release_date}</div>
            <div className="movie__director">Director: {movieData.director}</div>
            <div className="movie__certificate">Certificate: {movieData.certificate}</div>
            <div className="movie__language">Language: {movieData.language}</div>
            <div className="movie__genres">
              {Array.isArray(movieData.genres) && movieData.genres.map((genre, index) => (
                <span key={index} className="movie__genre">{genre}</span>
              ))}
            </div>
          </div>

          <div className="movie__detailRightBottom">
            <div className="synopsisText">Synopsis</div>
            <div>{movieData.overview}</div>
          </div>
        </div>
      </div>

      <div className="trailer">
        <div className="trailer_heading">Trailer/Teaser</div>
          {!trailerUrl ? (
            <button className="watchTrailerBtn" onClick={fetchTrailer}>
              Watch Trailer
            </button>
          ) : (
            <div className="trailer_container">
              <button className="closeTrailerBtn" onClick={() => setTrailerUrl(null)}>×</button>
                <iframe
                  src={trailerUrl}
                  title="Movie trailer"
                  width="1200"
                  height="550"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
            </div>
          )}
      </div>

   
      <div className="movie__heading">Cast</div>
      <div className="movie__cast">
        {Array.isArray(movieData.cast) && movieData.cast.map(([actor, img], idx) => (
          <div key={idx} className="castMember">
            {img !== "No Image" ? (
              <img className="castImage" src={img} alt={actor} />
            ) : (
              <div className="castImage noImage">No Image</div>
            )}
            <span className="castName">{actor}</span>
          </div>
        ))}
      </div>

      <div className="movie__heading">Reviews</div>
      {movie && movie.title && movie.release_date && <Review movie={movie} />} 

      {movieData.watch_link && movieData.watch_link.length > 0 && (
        <div className="movie__watchLinks">
          <div className="movie__heading">Watch on</div>
          <div className="movie__watchLinkItems">
            {Array.isArray(movieData.watch_link) && movieData.watch_link.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="watchLinkIcon">
                <img src={link.icon} alt="Platform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MovieDetail;









