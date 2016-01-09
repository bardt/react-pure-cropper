import React, { Component, PropTypes } from 'react';

import './styles/index.css';

export default class PureCropper extends Component {
  static propTypes = {
    // URL or data-url of image to be cropped
    originalImage: PropTypes.string.isRequired,
    // Area in real pixels which is desired to be cropped
    cropArea: PropTypes.object,
    // Visual selection position and size
    selectionPosition: PropTypes.object
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


    function gatherAreaSize(containerSize, aspectRatio) {
      const width = containerSize.width * 0.6;
      const left = (containerSize.width - width) / 2;
      const height = width / aspectRatio;
      const top = (containerSize.height - height) / 2;
      return {
        width,
        height,
        left,
        top
      };
    }

    if (selectionAspectRatio >= holderAspectRatio) {
      return gatherAreaSize(holderSize, selectionAspectRatio);
    }

    const countedArea = gatherAreaSize({
      width: holderSize.height,
      height: holderSize.width
    }, 1 / selectionAspectRatio);

    return {
      top: countedArea.left,
      left: countedArea.top,
      width: countedArea.height,
      height: countedArea.width
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
