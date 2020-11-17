import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pagination, Spin } from "antd";
import MoviesList from "../MoviesList";
import ErrorView from "../ErrorView";
import "./RatedMoviesPage.css";
import MovieService from "../../Services/MovieService";

const moviesServ = new MovieService();

const RatedMoviesPage = ({ guestSessionId, loadingGenres, tab, isRated }) => {
  const [movieData, setData] = useState(() => {
    const initState = {
      moviesList: [],
      totalResults: 0,
      currentPage: 1,
    };
    return initState;
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchRatedMovies = async (rated) => {
      if (!rated) {
        setErr("You should rate movie first.");
        setLoading(false);
        return;
      }
      try {
        const {
          results: movies,
          total_results: total,
          page,
        } = await moviesServ.getRatedMovies(guestSessionId);

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
    searchRatedMovies(isRated);
  }, [tab, guestSessionId, isRated]);

  const hasData = !(loading || loadingGenres || err || !movieData.totalResults);

  const hasError =
    (!movieData.totalResults || err) && !loading && !loadingGenres;

  const isLoading = loading;

  const errorView = hasError ? <ErrorView err={err} /> : null;

  const spinnerView = isLoading ? (
    <Spin className="app__spinner" tip="Loading..." size="large" />
  ) : null;

  const contentView = hasData ? (
    <>
      <div className="movies">
        <MoviesList moviesList={movieData.moviesList}  rateMovie={null}/>
      </div>
      <div className="pagination">
        <Pagination
          current={movieData.currentPage}
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
      {errorView}
      {spinnerView}
      {contentView}
    </>
  );
};

RatedMoviesPage.propTypes = {
  guestSessionId: PropTypes.string.isRequired,
  loadingGenres: PropTypes.bool.isRequired,
  isRated: PropTypes.bool.isRequired,
  tab: PropTypes.number.isRequired,
};

export default RatedMoviesPage; 