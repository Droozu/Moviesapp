import React, { Component } from "react";
import { Tabs, Alert, Input, Pagination } from 'antd';

import debounce from "lodash.debounce";
import {
	GenresProvider,
	ServiceApiProvider,
} from "../../services/ServicesAPIContext";

import 'antd/dist/antd.css';
import './App.css';
import Spinner from "../Spinner";
import ServicesAPI from "../../services/ServicesAPI";


export default class App extends Component {
	servicesAPI = new ServicesAPI();

	constructor(props) {
		super(props);
		this.state = {
			movies: [],
			ratedMovies: [],
			loaded: false,
			error: null,
			page: 1,
			ratedPage: 1,
			selectedTab: 1,
			totalPages: 1,
			ratedPages: 1,
		};
		this.lastQuery = "";
		this.page = 1;
		this.genres = {};

	}

	async componentDidMount() {
		this.movieApi.getGenres();
		if(!sessionStorage.getItem('session')) this.movieApi.createGuestSession();
	};

	componentDidCatch() {
		this.setState({
			hasError: true
		});
	};

	tabChange = (activeKey) => {
		if (Number(activeKey) === 2) {
			this.setState({
				request: null,
				pages: {
					totalPages: null,
					currentPage: null,
				},
				activeTab: activeKey,
			});
		}
		if (Number(activeKey) === 1) {
			const { label, pages } = this.state;


			this.setState({
				request: label,
				pages,
				activeTab: activeKey,
			});

		}

	};

	getPageData = (total, current) => {
		this.setState({
			pages: {
				totalPages: total,
				currentPage: current,
			}
		});
	};

	onNewPage = (page) => {
		const { pages: { totalPages, currentPage } } = this.state;

		if (currentPage >= 1 || currentPage <= totalPages) {
			this.setState({
				pages: {
					currentPage: page,
				}
			});
		}
	};

	setRating = async (value, id) => {
		console.log(id);
		const key = (JSON.parse(sessionStorage.getItem('session'))).token;
		await this.movieApi.setRating(id, key, {value});
	};

	onSearch = (e) => {

		this.setState({
				label: e.target.value
			},
			debounce(() => {
				// eslint-disable-next-line react/destructuring-assignment
				if (this.state.label.trim() !== "") {
					this.setState({
						// eslint-disable-next-line react/no-access-state-in-setstate,react/destructuring-assignment
						request: this.state.label
					});
				};
			}, 1500));

	};

	render() {
		const { request, pages: {totalPages, currentPage}, hasError, activeTab, label } = this.state;
		if(hasError) return <Alert status="warning" title="К сожалению, что-то пошло не так. Мы работаем над устранением причин." />

		return (
		<GenresProvider value={this.genres}>
			<ServiceApiProvider value={ServicesAPI}>
				<Tabs
					className="ant-tabs"
					defaultActiveKey="1"
					centered
					onTabClick={(activeKey) => this.tabChange(activeKey)}>
						<Tabs.TabPane tab="Search" key="1">

							<Input
								placeholder="Type to search..."
								type="text"
								value={label}
								onChange={this.onSearch} />


							<MoviesList
								getMoviesData={this.movieApi.getPopular}
								request={request}
								currentPage={currentPage}
								getRequestedData={this.movieApi.searchMovies}
								getPageData={this.getPageData}
								setRating={this.setRating}
								label={label}
								tabKey={activeTab}/>


							<Pagination
								size="small"
								total={totalPages || 1}
								current={currentPage}
								onChange={(e) => this.onNewPage(e)} />

						</Tabs.TabPane>
					<Tabs.TabPane tab="Rated" key="2">

						<MoviesList
							getMoviesData={this.movieApi.getRated}
							getPageData={this.getPageData}
							currentPage={currentPage}
							setRating={this.setRating}
							tabKey={activeTab}/>

						<Pagination
							size="small"
							total={totalPages}
							current={currentPage}
							onChange={(e) => this.onNewPage(e)} />

					</Tabs.TabPane>
				</Tabs>
			</ServiceApiProvider>
		</GenresProvider>

		)
	}
}

