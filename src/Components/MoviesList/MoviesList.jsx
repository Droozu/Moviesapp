import React from "react";
import PropTypes from "prop-types";
import "./MoviesList.css";

import Movie from "../Movie";

const MoviesList = ({ moviesList, rateMovie }) => {
  const renderMovies = moviesList.map((movie) => {
    return (
      <Movie
        key={`${movie.id}${movie.popularity}`}
        movie={movie}
        rateMovie={rateMovie}
      />
    );
  });
  return <>{renderMovies}</>;
};

MoviesList.propTypes = ({
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  rateMovie: PropTypes.func.isRequired,
});

export default MoviesList;
