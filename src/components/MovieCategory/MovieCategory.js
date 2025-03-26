import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MovieList from '../MovieList/MovieList';
import Header from '../Header/Header';

const MovieCategory = () => {

  const { category } = useParams();
  const type = category.toLowerCase();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("cineflix_token");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      if (token) {
        try {
          const res = await axios.get(`https://cineflix-production.up.railway.app/movies/${type}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setMovies(res.data.movies);
        } catch (err) {
          console.error("Failed to fetch movie details: ", err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchMovies();
  }, [type, token]); 
  


  return (
    <div>
      <Header />
      <MovieList movies={movies} loading={loading} />
    </div>
  )
}

export default MovieCategory
