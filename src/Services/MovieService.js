export default class MovieService {
  apiUrl = process.env.REACT_APP_API_URL;

  apiImgUrl = "https://image.tmdb.org/t/p/w200";

  async request(...params) {
    const [url, data] = params;

    try {
      const response = data
        ? await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data),
          })
        : await fetch(url);
      const requestResult = await response.json();
      return requestResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getMoviesByKeyword(keyword = "game", pageNumber = 1) {
    return this.request(
      `${this.apiUrl}search/movie?${process.env.REACT_APP_API_KEY}&query=${keyword}&page=${pageNumber}&include_adult=false`
    );
  }

  async getRatedMovies(guestSessionId) {
    return this.request(
      `${this.apiUrl}guest_session/${guestSessionId}/rated/movies?${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=created_at.asc`
    );
  }

  async getGenres() {
    return this.request(
      `${this.apiUrl}genre/movie/list?${process.env.REACT_APP_API_KEY}&language=en-US`
    );
  }

  async getGuestSession() {
    const res = await this.request(
      `${this.apiUrl}authentication/guest_session/new?${process.env.REACT_APP_API_KEY}`
    );
    if (!res.success) {
      throw new Error("Can`t create guest session");
    }
    return res;
  }

  async rateMovieById(movieId, guestSessionId, data) {
    const res = await this.request(
      `${this.apiUrl}movie/${movieId}/rating?${process.env.REACT_APP_API_KEY}&guest_session_id=${guestSessionId}`,
      data
    );

    return res.status_message;
  }
} 