import React, { Component, PropTypes } from 'react';

import './styles/index.css';
import PureCropperPreview, { getTransformations } from './preview';

export const normalizeArea = (cropArea, originalImageSize, minSize = { width: 0, height: 0 }) => {
  let { top, left, width, height } = cropArea;

  // Shrink
  if (width < minSize.width) {
    width = minSize.width;
  }

  if (height < minSize.height) {
    height = minSize.height;
  }

  // Keep inside of original image
  if (width > originalImageSize.width) {
    width = originalImageSize.width;
  }

  if (height > originalImageSize.height) {
    height = originalImageSize.height;
  }

  if (left < 0) {
    left = 0;
  }

  if (top < 0) {
    top = 0;
  }

  if (left > (originalImageSize.width - width)) {
    left = originalImageSize.width - width;
  }

  if (top > (originalImageSize.height - height)) {
    top = originalImageSize.height - height;
  }

  return {
    top,
    left,
    height,
    width
  };
};

export const unsafeZoom = (cropArea, zoomAmount) => {
  const { top, left, width, height } = cropArea;
  const zoomedArea = {
    width: width + zoomAmount,
    height: height + zoomAmount,
    top: top - Math.floor(zoomAmount / 2),
    left: left - Math.floor(zoomAmount / 2)
  };

  return zoomedArea;
};

export const zoom = (cropArea, zoomAmount, originalImageSize, minSize) => {
  return normalizeArea(unsafeZoom(cropArea, zoomAmount), originalImageSize, minSize);
};

export default class PureCropper extends Component {
  static propTypes = {
    // URL or data-url of image to be cropped
    originalImage: PropTypes.string.isRequired,
    // Area in real pixels which is desired to be cropped
    cropArea: PropTypes.object,
    // Visual selection position and size
    selectionPosition: PropTypes.object,

    style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  }

  countSelectionArea() {
    const { cropArea } = this.props;
    const selectionAspectRatio = cropArea.width / cropArea.height;
    const holderSize = this.props.style;
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
      originalImage,
      style
    } = this.props;

    const holderStyle = {
      ...style,
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
      <div style={ holderStyle } >
        <img
          src={ originalImage }
          style={ backgroundStyle }
        />
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
