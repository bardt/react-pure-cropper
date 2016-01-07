import React, { Component, PropTypes } from 'react';

import './styles/index.css';

export default class PureCropper extends Component {
  static propTypes = {
    originalImage: PropTypes.string.isRequired,
    cropArea: PropTypes.object
  }

  getHolderSize() {
    // @TODO: hardcoded in styles. Count from DOM ?
    return {
      width: 400,
      height: 300
    };
  }

  countSelectionArea() {
    const { cropArea } = this.props;
    const selectionAspectRatio = cropArea.width / cropArea.height;
    const holderSize = this.getHolderSize();
    const holderAspectRatio = holderSize.width / holderSize.height;

    if (selectionAspectRatio >= holderAspectRatio) {
      const width = holderSize.width * 0.6;
      const left = (holderSize.width - width) / 2;
      const height = width / selectionAspectRatio;
      const top = (holderSize.height - height) / 2;
      return {
        width,
        height,
        left,
        top
      };
    }

    const height = holderSize.height * 0.6;
    const top = (holderSize.height - height) / 2;
    const width = height * selectionAspectRatio;
    const left = (holderSize.width - width) / 2;
    return {
      width,
      height,
      left,
      top
    };
  }

  render() {
    const {
      originalImage
    } = this.props;

    const selectionArea = this.countSelectionArea();
    const selectionStyle = {
      left: selectionArea.left,
      top: selectionArea.top,
      width: selectionArea.width,
      height: selectionArea.height
    };

    return (
      <div ref="holder" className="image-holder">
        <div className="original-image">
          <img src={ originalImage }/>
        </div>
        <div className="overlay"></div>
        <div className="selection" style={ selectionStyle }>
          <img src={ originalImage }/>
        </div>
      </div>
    );
  }
}
