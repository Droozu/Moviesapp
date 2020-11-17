import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Search.css";
import { debounce } from "lodash";

export default class Search extends Component {
  static propTypes = {
    onChangeKeyword: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      label: "",
    };

    this.updateResults = debounce(this.updateResults, 1000);
  }

  onChangeLabel = ({ target: { value } }) => {
    this.setState({
      label: value,
    });
    this.updateResults(value);
  };

  updateResults = (label) => {
    const { onChangeKeyword } = this.props;
    if (label.trim()) {
      onChangeKeyword(label);
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { onChangeKeyword } = this.props;
    const { label } = this.state;

    if (label.trim()) {
      onChangeKeyword(label);
    }

    this.setState({
      label: "",
    });
  };

  render() {
    const { label } = this.state;

    return (
      <form className="search" onSubmit={this.onSubmit}>
        <input
          className="search__query"
          placeholder="Type to search..."
          onChange={this.onChangeLabel}
          value={label}
        />
      </form>
    );
  }
} 