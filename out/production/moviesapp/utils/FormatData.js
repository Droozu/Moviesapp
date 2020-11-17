export default class FormatData {

	mergeData = async (all, rated) => {
		const mergedData = Object.keys(all).map((key) => {
			if(key in rated) return rated[key]
			return all[key];
		});

		return mergedData;
	};

	arrayToObject = (data) => {
		const res = {};
		data.forEach(elem => { res[elem.id] = elem });
		return res;
	};

	formatMovieData = async (movies, genres) => {
		const data = {};
		Object.values(movies).map(movie => {
			const newGenres = movie.genre_ids
				.slice(0, 2)
				.map(genre => genres[genre])
				.filter(genre => genre)
				.map(genre => genre.name);

			data[movie.id] = {
				id: movie.id,
				title: movie.title || movie.name || "Название отсутствует",
				genres: newGenres,
				description: movie.overview || "Описание временно отсутствует",
				poster: movie.poster_path,
				background: movie.backdrop_path,
				release: movie.release_date,
				userRating: movie.rating || 0,
				averageRating: movie.vote_average || 0,
				rating: movie.rating || 0
			}
			return data;
		});
		return data;
	};
}