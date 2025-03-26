import React from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import "./Card.css"
import { Link } from 'react-router-dom'

const Card = ({ movie }) => {


  return (
    <>
    <Link to={`/movie/${encodeURIComponent(movie.title)}`} state={{ movie }} style={{ textDecoration: "none", color: "white" }}>
      <div className='cards'>
        <img
          className='cards__img'
          src={movie.poster !== "No Image" ? `https://image.tmdb.org/t/p/original/${movie.poster.split("/").pop()}` : "/default-poster.jpg"}
          alt={movie.title}
        />
        <div className='cards__overlay'>
          <div className='card__title'>{movie.title}</div>
          <div className='card__runtime'>
            {movie.release_date}
          </div>
          <div className='card__description'>

            {movie.overview && movie.overview.length > 100 ? movie.overview.slice(0, 100) + "..." : movie.overview}
          </div>
        </div>
      </div>
    </Link>
    </>
  )
}

export default Card



