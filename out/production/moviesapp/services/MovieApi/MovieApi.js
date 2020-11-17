import FormatData from '../utils/FormatData';

export default class MovieApi {
  baseURL = 'https://api.themoviedb.org/3';

  apiKey = process.env.REACT_APP_API_KEY;

  apiLang = `&language=ru`;

  formatData = new FormatData();

  genres = {};

  getRequest = async (url, obj = null) => {
    const res = await fetch(`${this.baseURL}${url}`, obj);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status} `);
    }
    const result = await res.json();
    return result;
  };

  getGenres = async () => {
    this.genres = await this.getRequest(
        `/genre/movie/list${this.apiKey}${this.apiLang}`)
            .then(({ genres }) =>
                this.formatData.arrayToObject(genres)
            );
    return this.genres;
  };

  getRated = async () => {
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (!session) {
      return {
        movies: [],
        currentPage: 1,
        totalPages: 1,
      };
    }

    const res = await this.getRequest(
      `/guest_session/${session.token}/rated/movies${this.apiKey}${this.apiLang}&sort_by=created_at.asc`
    );
    const ratedMovies = await this.formatData.formatMovieData(res.results, this.genres);
    return {
      movies: ratedMovies,
      currentPage: res.page,
      totalPages: res.total_pages,
    };
  };

  getPopular = async () => {
    const ratedMovies = await (await this.getRated()).movies;
    const popularMovies = await this.getRequest(`/movie/popular${this.apiKey}${this.apiLang}`).then((res) =>
      this.formatData.formatMovieData(res.results, this.genres)
    );
    const mergedMovies = await this.formatData.mergeData(popularMovies, ratedMovies);

    return {
      movies: mergedMovies,
      currentPage: 1,
      totalPages: 1,
    };
  };

  searchMovies = async (query, page) => {
    const ratedMovies = await (await this.getRated()).movies;
    const res = await this.getRequest(
      `/search/movie${this.apiKey}${this.apiLang}&query=${query}&page=${page}&include_adult=false`
    );
    const searchedMovies = await this.formatData
      .formatMovieData(res.results, this.genres)
      .then((result) => this.formatData.mergeData(result, ratedMovies));

    return {
      movies: searchedMovies,
      currentPage: res.page,
      totalPages: res.total_pages,
    };
  };

  createGuestSession = async () => {
    const res = await this.getRequest(`/authentication/guest_session/new${this.apiKey}`);
    const session = {
      token: res.guest_session_id,
      expiry: res.expires_at,
    };

    sessionStorage.setItem('session', JSON.stringify(session));
  };

  setRating = async (id, session, data) => {
    const res = await this.getRequest(`/movie/${id}/rating${this.apiKey}&guest_session_id=${session}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  };
}
