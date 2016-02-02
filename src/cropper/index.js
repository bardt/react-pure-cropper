import React, { Component, PropTypes } from 'react';
import PureCropperPreview, { getTransformations } from '../preview';

export default class PureCropper extends Component {
  static propTypes = {
    // URL or data-url of image to be cropped
    originalImage: PropTypes.string.isRequired,
    // Area in real pixels which is desired to be cropped
    cropArea: PropTypes.object,
    // Visual selection position and size
    selectionPosition: PropTypes.object,

    aspectRatio: PropTypes.number.isRequired,

    size: PropTypes.shape({
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
    const { aspectRatio, size } = this.props;
    const holderAspectRatio = size.width / size.height;


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
      return gatherAreaSize(size, aspectRatio);
    }

    const countedArea = gatherAreaSize({
      width: size.height,
      height: size.width
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
      event.preventDefault();
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
      size
    } = this.props;

    const noSelectStyle = {
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      OUserSelect: 'none',
      userSelect: 'none'
    };

    const holderStyle = {
      ...size,
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
      ...noSelectStyle,
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
      opacity: 0.3,
      pointerEvents: 'none'
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
          size={ previewStyle }
        />
      </div>
    );
  }
}
