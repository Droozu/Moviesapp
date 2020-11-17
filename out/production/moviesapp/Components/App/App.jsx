import React, { Component } from "react";
import ServicesAPI  from '../../services/ServicesAPI'
// import LocalStorageAPI from "../../services/LocalStorageAPI";

class App extends Component {
	MoviesAPI = new ServicesAPI;

	componentDidMount() {
		this.MoviesAPI.createGuestSession();
		const db = this.MoviesAPI.getRatedMovies(1);
		console.log(db.then(item => item));
	};

	setRating = async (id, value) => {
		await this.MoviesAPI.setRating(id, value);
	};


	render() {

		return (
			<div>
				hello
			</div>

		)


	}
}

export default App;