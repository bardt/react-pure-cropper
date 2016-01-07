import React, { Component, PropTypes } from 'react';

import './styles/index.css';

export default class PureCropper extends Component {
  static propTypes = {
    originalImage: PropTypes.string.isRequired
  }

  render() {
    const {
      originalImage
    } = this.props;

    return (
      <div className="image-holder">
        <div className="original-image">
          <img src={ originalImage }/>
        </div>
        <div className="overlay"></div>
        <div className="selection">
          <img src={ originalImage }/>
        </div>
      </div>
    );
  }
}
