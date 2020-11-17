import React from 'react';
import PropTypes from 'prop-types';
import {Result} from 'antd';

import MoviesCard from '../MoviesCard';
import Spinner from '../Spinner';

import './MoviesList.css';

class MoviesList extends React.Component {

	state = {
		movies: null,
		loading: false,
		hasError: false,
	}


	async componentDidMount() {
		const { getMoviesData } = this.props;
		this.setState({
			loading: true,
		});

		await this.updatePage(getMoviesData);
	};

	componentDidUpdate(prevProps) {
		// eslint-disable-next-line react/prop-types
		const {request, currentPage, tabKey, getRequestedData, label, getMoviesData} = this.props;

		if(request && request !== prevProps.request) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({loading: true})
			this.updatePage(() => getRequestedData(request, 1));
		};

		if(request && currentPage !== prevProps.currentPage) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({loading: true})
			this.updatePage(() => getRequestedData(request, currentPage))
		};

		if (tabKey !== prevProps.tabKey) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({loading: true})
			// eslint-disable-next-line react/prop-types
			if (label !== "") {
				this.updatePage(() => getRequestedData(request, currentPage))
			} else {
				this.updatePage(() => getMoviesData);
			}
		};
	};

	componentDidCatch() {
		this.setState({hasError: true});
	};

	updatePage = async (func) => {
		await func()
			.then(this.onMoviesLoaded)
			.catch(this.onError)
	};

	onMoviesLoaded = async ({movies, totalPages, currentPage }) => {

		this.setState({
				movies,
				loading: false,
			}, () => {
			// eslint-disable-next-line react/destructuring-assignment
				this.props.getPageData(totalPages, currentPage)}
		);
	};

	onError = () => {
		this.setState({
			hasError: true,
			loading: false,
		});
	};

	moviesContent = () => {
		// const { setRating } = this.props;

		const {movies} = this.state;
		if(movies && Object.keys(movies).length === 0) {
			return <Result title="К сожалению, по вашему запросу фильмов не найдено" />
		};

		if(movies) {
			return Object.values(movies).map(movie => (
				<li className="movies-list__item" key={movie.id}>
					{/* eslint-disable-next-line react/destructuring-assignment */}
					<MoviesCard movie={movie} setRating={this.props.setRating} />
				</li>
			));
		};
		return <Spinner/>
	};

	render() {
		const {hasError, loading} = this.state;

		if(hasError) return <Result status="warning" title="К сожалению, что-то пошло не так. Мы работаем над устранением причин." />

		const content = loading
			? <Spinner/>
			: this.moviesContent();

		return (
			<React.Suspense fallback={<Spinner />}>
				<ul className="movies-list"> {content} </ul>
			</React.Suspense>

	);
	};
};

MoviesList.propTypes = {
	getMoviesData: PropTypes.func.isRequired,
	getRequestedData: PropTypes.func,
	getPageData: PropTypes.func.isRequired,
	setRating: PropTypes.func.isRequired,
	request: PropTypes.string,
	currentPage: PropTypes.number,
	tabKey: PropTypes.string.isRequired
}

MoviesList.defaultProps = {
	request: null,
	currentPage: null,
	getRequestedData: () => {},
};

export default MoviesList;




