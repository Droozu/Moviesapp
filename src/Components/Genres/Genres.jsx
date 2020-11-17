import React from "react";
import PropTypes from "prop-types";
import "./Genres.css";

import { GenresConsumer } from "../GenresContext";

const Genres = ({ genres }) => {
  return (
    <div className="Genres">
      <GenresConsumer>
        {(genresList) => {
          const [first, second] = genres.map((genreId) => {
            const [one] = genresList.filter((item) => item.id === genreId);
            const { id, name } = one;

            return (
              <div key={`${id}`} className="genres__item">
                {name}
              </div>
            );
          });

          return (
            <>
              {first}
              {second}
            </>
          );
        }}
      </GenresConsumer>
    </div>
  );
};

Genres.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Genres; 