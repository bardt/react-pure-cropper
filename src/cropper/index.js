import React, { Component, PropTypes } from 'react';

import PureCropperPreview, { getTransformations } from '../preview';

const defaultMinSize = {
  width: 1,
  height: 1
};

export const normalizeArea = (cropArea, aspectRatio, originalSize, minSize = defaultMinSize) => {
  let { top, left, width, height } = cropArea;

  // Shrink
  if (width < minSize.width) {
    width = minSize.width;
    height = Math.ceil(width / aspectRatio);
  }

  if (height < minSize.height) {
    height = minSize.height;
    width = Math.ceil(height * aspectRatio);
  }

  // Keep inside of original image
  if (width > originalSize.width) {
    width = originalSize.width;
    height = Math.floor(width / aspectRatio);
  }

  if (height > originalSize.height) {
    height = originalSize.height;
    width = Math.floor(height * aspectRatio);
  }

  if (left < 0) {
    left = 0;
  }

  if (top < 0) {
    top = 0;
  }

  if (left > (originalSize.width - width)) {
    left = originalSize.width - width;
  }

  if (top > (originalSize.height - height)) {
    top = originalSize.height - height;
  }

  return {
    top,
    left,
    height,
    width
  };
};

export const unsafeZoom = (cropArea, aspectRatio, zoomAmount) => {
  const { top, left, width, height } = cropArea;

  const getSizes = (significantSize) => {
    const secondaryRatio = Math.min(aspectRatio, 1 / aspectRatio);

    return {
      main: significantSize + zoomAmount,
      secondary: (significantSize + zoomAmount) * secondaryRatio
    };
  };

  const sizes = aspectRatio >= 1
    ? getSizes(width)
    : getSizes(height);

  const zoomedSize = {
    width: aspectRatio >= 1 ? sizes.main : sizes.secondary,
    height: aspectRatio >= 1 ? sizes.secondary : sizes.main
  };

  return {
    ...zoomedSize,
    left: left + Math.round((width - zoomedSize.width) / 2),
    top: top + Math.round((height - zoomedSize.height) / 2)
  };
};

export const zoom = (cropArea, aspectRatio, zoomAmount, originalImageSize, minSize) => {
  return normalizeArea(
      unsafeZoom(cropArea, aspectRatio, zoomAmount),
      aspectRatio, originalImageSize, minSize
    );
};

export default class PureCropper extends Component {
  static propTypes = {
    // URL or data-url of image to be cropped
    originalImage: PropTypes.string.isRequired,
    // Area in real pixels which is desired to be cropped
    cropArea: PropTypes.object,
    // Visual selection position and size
    selectionPosition: PropTypes.object,

    aspectRatio: PropTypes.number.isRequired,

    style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired,

    onZoom: PropTypes.func,
    onDrag: PropTypes.func
  }

  static defaultProps = {
    onZoom: () => undefined,
    onDrag: () => undefined
  }

  countSelectionArea() {
    const { aspectRatio } = this.props;
    const holderSize = this.props.style;
    const holderAspectRatio = holderSize.width / holderSize.height;


    function gatherAreaSize(containerSize, ratio) {
      const width = containerSize.width * 0.6;
      const left = (containerSize.width - width) / 2;
      const height = width / ratio;
      const top = (containerSize.height - height) / 2;
      return {
        width,
        height,
        left,
        top
      };
    }

    if (aspectRatio >= holderAspectRatio) {
      return gatherAreaSize(holderSize, aspectRatio);
    }

    const countedArea = gatherAreaSize({
      width: holderSize.height,
      height: holderSize.width
    }, 1 / aspectRatio);

    return {
      top: countedArea.left,
      left: countedArea.top,
      width: countedArea.height,
      height: countedArea.width
    };
  }

  handleMouseWheel(event) {
    event.preventDefault();
    const { deltaX, deltaY } = event;
    const significantDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

    this.props.onZoom(significantDelta);
  }

  handleMouseDown(event) {
    this.dragging = true;
    this.mouseCoords = {
      x: event.pageX,
      y: event.pageY
    };
  }

  handleMouseUp() {
    this.dragging = false;
    this.mouseCoords = {};
  }

  handleMouseMove(event) {
    if (this.dragging) {
      this.props.onDrag({
        diffX: event.pageX - this.mouseCoords.x,
        diffY: event.pageY - this.mouseCoords.y,
      });

      this.mouseCoords = {
        x: event.pageX,
        y: event.pageY
      };
    }
  }

  handleMouseLeave() {
    this.dragging = false;
    this.mouseCoords = {};
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
      pointerEvents: 'none',
      transformOrigin: `${originX}px ${originY}px`,
      transform: `
        translate(
          ${ holderStyle.width / 2 - originX }px,
          ${ holderStyle.height / 2 - originY }px
        )
        scale(${scale})
      `
    };

    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'black',
      opacity: 0.3
    };

    return (
      <div style={ holderStyle }
        onWheel={ this::this.handleMouseWheel }
        onMouseDown={ this::this.handleMouseDown }
        onMouseUp={ this::this.handleMouseUp }
        onMouseMove={ this::this.handleMouseMove }
        onMouseLeave={ this::this.handleMouseLeave }
      >
        <img
          src={ originalImage }
          style={ backgroundStyle }
        />
      <div className="overlay" style={ overlayStyle }/>
        <PureCropperPreview
          cropArea={ cropArea }
          originalURL={ originalImage }
          style={ previewStyle }
        />
      </div>
    );
  }
}
