import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@edx/paragon';

export default class PageLoading extends Component {
  renderSrMessage() {
    if (!this.props.srMessage) {
      return null;
    }

    return (
      <span className="sr-only">
        {this.props.srMessage}
      </span>
    );
  }

  render() {
    return (
        <div
          className="d-flex justify-content-center align-items-center flex-column h-100"
        >
          <Spinner animation="border" variant="primary" role="status">
            {this.renderSrMessage()}
          </Spinner>
        </div>
    );
  }
}

PageLoading.propTypes = {
  srMessage: PropTypes.node.isRequired,
};
