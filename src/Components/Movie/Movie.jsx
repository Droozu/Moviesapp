import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import "./Movie.css";
import { Card, Rate } from "antd";
import Genres from "../Genres";

const { Meta } = Card;

const cropText = (text, maxLength = 1000) => {
  if (text.length <= maxLength) {
    return text;
  }

  let str = text.slice(0, maxLength);
  const array = str.split(" ");
  array.splice(array.length - 1, 1);
  str = array.join(" ");
  return `${str}...`;
};

const Movie = ({ movie, rateMovie }) => {
  const {
    id,
    rating,
    original_title: originalTitle = "title",
    poster_path: imgUrl,
    overview = "overview",
    release_date: releaseDate = "2003-02-25",
    genre_ids: genres,
    vote_average: voteAverage = 0,
  } = movie;

  let voteClass = "gold";

  switch (true) {
    case voteAverage < 3:
      voteClass = "red";
      break;

    case voteAverage > 3 && voteAverage < 5:
      voteClass = "orange";
      break;

    case voteAverage > 5 && voteAverage <= 7:
      voteClass = "gold";
      break;

    case voteAverage > 7:
      voteClass = "green";
      break;

    default:
      break;
  }

  return (
    <Card
      className="movie"
      style={{ width: 454, display: "flex" }}
      cover={
        <img
          alt="poster"
          className="movie__cover"
          src={
            imgUrl
              ? `https://image.tmdb.org/t/p/w200${imgUrl}`
              : "https://image.tmdb.org/t/p/w200/8QGF0PtMlTK1cU30WjNItVbO1Jd.jpg"
          }
        />
      }
    >
      <Meta
        title={cropText(originalTitle, 23)}
        description={
          releaseDate ? format(new Date(releaseDate), "MMMM dd, yyyy") : null
        }
      />
      <div className={`movie__vote movie__vote__${voteClass}`}>
        {voteAverage}
      </div>
      <Genres genres={genres} />

      <div className="movie__description">{cropText(overview, 200)}</div>
      <Rate
        className="movie__rate"
        count={10}
        allowHalf
        defaultValue={rating}
        // value={rating}
        style={{ fontSize: 15 }}
        onChange={(value) => {
          rateMovie(id, { value });
        }}
      />
    </Card>
  );
};

Movie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    rating: PropTypes.number,
    original_title: PropTypes.string,
    poster_path: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  rateMovie: PropTypes.func.isRequired,
};

export default Movie; 