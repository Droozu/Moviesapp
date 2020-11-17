import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pagination, Spin } from "antd";
import MoviesList from "../MoviesList";
import ErrorView from "../ErrorView";
import Search from "../Search";
import "./MoviesPage.css";
import MovieService from "../../Services/MovieService";

const moviesServ = new MovieService();

const MoviesView = ({ guestSessionId, loadingGenres, setIsRated }) => {
  const [movieData, setData] = useState(() => {
    const initState = {
      moviesList: [],
      totalResults: 0,
      currentPage: 1,
    };
    return initState;
  });
  const [keyword, setKeyword] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const searchMovies = async (queryWord, pageNumber = 1) => {
    try {
      const {
        results: movies,
        total_results: total,
        page,
      } = await moviesServ.getMoviesByKeyword(queryWord === "" ? 'return' : queryWord, pageNumber);

      if (!total) {
        setErr("Sorry, no results were found for your search.");
        setLoading(false);
        return;
      }

      setData({
        moviesList: movies,
        totalResults: total,
        currentPage: page,
      });
      setLoading(false);
      setErr("");
    } catch ({ message }) {
      if (message === "Failed to fetch") {
        setErr("Sorry, you have problem with network");
      } else {
        setErr(message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMovies();
  }, []);

  const onChangeKeyword = (newKeyword) => {
    searchMovies(newKeyword);
    setKeyword(newKeyword);
    setErr(false);
  };

  const rateMovie = async (movieId, data) => {
    try {
      await moviesServ.rateMovieById(movieId, guestSessionId, data);
    } catch (error) {
      setErr("Error with rate this movie");
    }
    setIsRated();
  };

  const onChangePage = (page) => {
    searchMovies(keyword, page);
  };

  const hasData = !(loading || loadingGenres || err || !movieData.totalResults);

  const hasError =
    (!movieData.totalResults || err) && !loading && !loadingGenres;

  const errorView = hasError ? <ErrorView err={err} /> : null;

  const spinnerView = loading ? (
    <Spin className="app__spinner" tip="Loading..." size="large" />
  ) : null;

  const contentView = hasData ? (
    <>
      <div className="movies">
        <MoviesList moviesList={movieData.moviesList} rateMovie={rateMovie} />
      </div>
      <div className="pagination">
        <Pagination
          current={movieData.currentPage}
          onChange={onChangePage}
          size="small"
          total={movieData.totalResults}
          defaultPageSize={20}
          showSizeChanger={false}
        />
      </div>
    </>
  ) : null;

  return (
    <>
      <Search onChangeKeyword={onChangeKeyword} />
      {errorView}
      {spinnerView}
      {contentView}
    </>
  );
};

MoviesView.propTypes = {
  guestSessionId: PropTypes.string.isRequired,
  loadingGenres: PropTypes.bool.isRequired,
  setIsRated: PropTypes.func.isRequired,
};

export default MoviesView; 