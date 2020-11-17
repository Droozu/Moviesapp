import React, { Component } from "react";
import { Tabs } from "antd";
import MovieService from "../../Services/MovieService";
import MoviesPage from "../MoviesPage";
import RatedMoviesPage from "../RatedMoviesPage";
import { GenresProvider } from "../GenresContext";

import "antd/dist/antd.css";
import "./App.css";

const moviesServ = new MovieService();
const { TabPane } = Tabs;

export default class App extends Component {
  state = {
    guestSessionId: "",
    genres: [],
    loadingGenres: true,
    tab: 1,
    isRated: false,
  };

  async componentDidMount() {
    const { genres, guestSessionId } = this.state;
    if (!guestSessionId) {
      await this.createGuestSession();
    }
    if (!genres.length) {
      await this.searchGenres();
    }
  }

  onChangeTab = async (key) => {
    this.setState({ tab: key });
  };

  setIsRated = () => {
    this.setState({ isRated: true });
  };

  async createGuestSession() {
    try {
      const {
        guest_session_id: guestSessionId,
      } = await moviesServ.getGuestSession();
      this.setState(() => {
        return { guestSessionId };
      });
    } catch (error) {
      this.onError();
    }
  }

  async searchGenres() {
    try {
      const { genres } = await moviesServ.getGenres();
      this.setState(() => {
        return { genres, loadingGenres: false };
      });
    } catch (error) {
      this.onError();
    }
  }

  render() {
    const { genres, guestSessionId, loadingGenres, tab, isRated } = this.state;

    return (
        <div className="app">
          <div className="app__box">
            <GenresProvider value={genres}>
              <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
                <TabPane tab="Search" key="1">
                  <MoviesPage
                      guestSessionId={guestSessionId}
                      loadingGenres={loadingGenres}
                      setIsRated={this.setIsRated}
                  />
                </TabPane>
                <TabPane tab="Rated" key="2">
                  <RatedMoviesPage
                      guestSessionId={guestSessionId}
                      loadingGenres={loadingGenres}
                      tab={tab}
                      isRated={isRated}
                  />
                </TabPane>
              </Tabs>
            </GenresProvider>
          </div>
        </div>
    );
  }
}