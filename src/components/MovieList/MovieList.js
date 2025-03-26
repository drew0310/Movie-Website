import React from 'react';
import './MovieList.css';
import Card from '../Card/Card';

const MovieList = ({ movies, loading }) => {
  return (
    <>
      <h2 className="list__title">Search Results</h2>
      <div className="list__cards">
        {loading ? (
          Array(15).fill().map((_, index) => (
            <div className="card__skeleton" key={index}></div>
          ))
        ) : movies.length > 0 ? (
          movies.map((movie, index) => (
            <Card key={index} movie={movie} />
          ))
        ) : (
          <center><p className="no-results">No movies found with given name!</p></center>
        )}
      </div>
    </>
  );
};

export default MovieList;




