import React from "react";
import PropTypes from "prop-types";
import { Result } from "antd";

const ErrorView = ({ err }) => {
  const errType = "warning";

  return <Result status={errType} title={err} />;
};

ErrorView.propTypes = {
  err: PropTypes.string.isRequired,
};

export default ErrorView; 