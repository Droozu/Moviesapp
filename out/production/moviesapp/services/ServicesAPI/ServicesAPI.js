import axios from 'axios';
import LocalStorageAPI from './LocalStorageAPI';
import GetResponseError from './GetResponseError';

class ServicesAPI {
	constructor() {
		this.guestSessionId = null;
		this.API = axios.create({
			baseURL: process.env.REACT_APP_API_URL,
			params: {
				api_key: process.env.REACT_APP_API_KEY,
			},
		});


	};

	getRequest = async (url, params = null) => {
		if (typeof url !== 'string') {
			throw new TypeError(`Parameter 'url' must be a string, not ${ typeof url }`);
		}

		return this.API.get(`${ url }`, params)
			.then((response) => response.data)
			.catch((error) => {
				if (!error.response) {
					throw new GetResponseError('There is no internet connection!', error);
				}
				if (error.response.data.status_code === 3) {
					this.createGuestSession(true);
				}
				throw new GetResponseError(`There's error while fetching!`, error);
			});
	};

	getGenres = async () => {
		return this.getRequest("genre/movie/list");
	};

	createGuestSession = async () => {
		const sessionIsCreated = LocalStorageAPI.loadItem('guestSessionId');
		if (!LocalStorageAPI.loadItem('guestSessionId')) {
			const {guest_session_id: id} = await this.getRequest('authentication/guest_session/new');
			this.guestSessionId = id;

			LocalStorageAPI.saveItem('guestSessionId', this.guestSessionId);

			return;
		}
		this.guestSessionId = sessionIsCreated;
	};

	postRequest = async (url, data, params) => {
		if (typeof url !== 'string') {
			throw new TypeError(`Parameter 'url' must be a string, not ${ typeof url }`);
		}

		return this.API.post(`${ url }`, data, params)
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			})
	};

	searchMovie = async (query = 'return', page = 1) => {
		return this.getRequest('search/movie', {
			params: {
				query: query.length === 0 ? 'return' : query,
				page: page > 0 ? page.toFixed() : 1,
			},
		});
	};

	setRating = async (id, rate) => {
		return this.postRequest(
			`movie/${ id }/rating`,
			{value: rate <= 0.5 ? 0.5 : rate},
			{
				params: {guest_session_id: this.guestSessionId},
			}
		);
	};

	getMovieInfo = async (id = 0) => {
		console.log(id)
		return this.getRequest(`movie/${ id }`);
	}

	getRatedMovies = async (page) => {
		return this.getRequest(
			`guest_session/${ this.guestSessionId }/rated/movies`,
			{
				params: {page: Number(page) > 0 ? page.toFixed() : 1}
			})
	}
}

export default ServicesAPI;
