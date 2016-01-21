import React, { Component, PropTypes } from 'react';

import './styles/index.css';
import PureCropperPreview, { getTransformations } from './preview';

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
      width: 500,
      height: 1000
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
      cropArea,
      originalImage
    } = this.props;

    const holderStyle = {
      ...this.getHolderSize(),
      background: 'cadetblue',
      position: 'relative',
      overflow: 'hidden'
    };

    const previewStyle = {
      ...this.countSelectionArea(),
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%)`,
      borderRadius: '50%',
      border: '1px solid black'
    };

    const {
      originX,
      originY,
      scale
    } = getTransformations(cropArea, previewStyle);

    const backgroundStyle = {
      transformOrigin: `${originX}px ${originY}px`,
      transform: `
        translate(
          ${ holderStyle.width / 2 - originX }px,
          ${ holderStyle.height / 2 - originY }px
        )
        scale(${scale})
      `
    };


    return (
      <div style={ holderStyle }>
        <img src={ originalImage } style={ backgroundStyle }/>
        <div className="overlay"/>
        <PureCropperPreview
          cropArea={ cropArea }
          originalURL={ originalImage }
          style={ previewStyle }
        />
      </div>
    );
  }
}
