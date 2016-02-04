import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import PureCropperPreview, { getTransformations, getScale } from '../preview';

export default class PureCropper extends PureComponent {
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
    const { aspectRatio, style } = this.props;
    const holderAspectRatio = style.width / style.height;

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
      return gatherAreaSize(style, aspectRatio);
    }

    const countedArea = gatherAreaSize({
      width: style.height,
      height: style.width
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

  handleMouseLeave() {
    this.dragging = false;
    this.mouseCoords = {};
  }

  handleMouseMove(event) {
    if (this.dragging) {
      event.preventDefault();

      const { cropArea } = this.props;
      const scale = getScale(this.countSelectionArea(), cropArea);

      this.props.onDrag({
        diffX: (event.pageX - this.mouseCoords.x) / scale,
        diffY: (event.pageY - this.mouseCoords.y) / scale
      });

      this.mouseCoords = {
        x: event.pageX,
        y: event.pageY
      };
    }
  }

  render() {
    const {
      cropArea,
      originalImage,
      style
    } = this.props;

    const noSelectStyle = {
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      OUserSelect: 'none',
      userSelect: 'none'
    };

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
      ...noSelectStyle,
      willChange: 'transform',
      pointerEvents: 'none',
      transformOrigin: `${originX}px ${originY}px`,
      msTransformOrigin: `${originX}px ${originY}px`,
      transform: `
        translate3d(
          ${ holderStyle.width / 2 - originX }px,
          ${ holderStyle.height / 2 - originY }px,
          0px
        )
        scale(${scale})
      `,
      msTransform: `
        translateX(${ holderStyle.width / 2 - originX }px)
        translateY(${ holderStyle.height / 2 - originY }px)
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
          originalImage={ originalImage }
          style={ previewStyle }
        />
      </div>
    );
  }
}
