import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Card, Badge, Rate } from 'antd';

import posterDefault from './img/no-poster.jpg';

import 'antd/dist/antd.css';
import './MoviesCard.css';


const MoviesCard = ( {movie, setRating}) => {
	const {
		averageRating,
		poster,
		title,
		release,
		id,
		genres,
		description,
		userRating
	} = movie;

	const moviePoster = poster ? `https://image.tmdb.org/t/p/w500${poster}` : posterDefault;
	const movieRelease = release ? (format(new Date(release), 'PP')) : "Дата выхода неизвестна";

	const borderColor = (rating) => {
		if(rating < 3) return 'red';
		if(rating >= 3 && rating < 5) return 'orange';
		if(rating >= 5 && rating < 7) return 'yellow';
		return 'green'
	}

	return (
		<Card >
			<Badge
				className={`ant-badge-count_${borderColor(averageRating)}`}
				count={averageRating}
				showZero
			/>

			<img className="ant-card-body__poster" src={moviePoster} alt="test" />

			<h1 className="ant-card-body__title"> {title.substring(0, 35)} </h1>

			<p className="ant-card-body__date"> {movieRelease} </p>

			<ul className="ant-card-body__genre"> { genres.map(genre => <li key={genre + id}>{genre}</li>) } </ul>

			<p className="ant-card-body__descr" > {description.substring(0, 150)} </p>

			<Rate
				allowHalf
				defaultValue={userRating}
				count={10}
				onChange={value => setRating(value, id)} />

		</Card>
	)
}

MoviesCard.defaultProps = {
	id: 0,
	averageRating: 0,
	poster: null,
	title: null,
	release: null,
	genres: [],
	description: "Описание временно отсутствует",
	userRating: 0,
}

MoviesCard.propTypes = {
	movie: PropTypes.objectOf(PropTypes.any).isRequired,
	averageRating: PropTypes.number,
	poster: PropTypes.string,
	title: PropTypes.string,
	release: PropTypes.string,
	id: PropTypes.number,
	genres: PropTypes.arrayOf(PropTypes.string),
	description: PropTypes.string,
	userRating: PropTypes.number,
	setRating: PropTypes.func.isRequired,
}

export default MoviesCard;
