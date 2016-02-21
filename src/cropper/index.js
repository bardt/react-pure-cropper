import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import PureCropperPreview, { getTransformations, getScale } from '../preview';

const BACKGROUND_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAFJJREFUSA3t0rENwCAMBVFgRy9pD+m0dCen5VIR6STE09+ZuSZfREzydUb1j9gLEE0iiVAAA1f0ANHubnzmHVTV/YtnVyQRCmDgiiRCAQxcERJ9bYcIOvgMZL8AAAAASUVORK5CYII='; // eslint-disable-line max-len

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
  };

  static defaultProps = {
    onZoom: () => undefined,
    onDrag: () => undefined
  };

  constructor(props) {
    super(props);

    this.handleMouseWheel = this::this.handleMouseWheel;
    this.handleMouseUp = this::this.handleMouseUp;
    this.handleMouseDown = this::this.handleMouseDown;
    this.handleMouseMove = this::this.handleMouseMove;
    this.handleMouseLeave = this::this.handleMouseLeave;
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
      background: `url(${BACKGROUND_IMAGE}) repeat`,
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
        onWheel={ this.handleMouseWheel }
        onMouseDown={ this.handleMouseDown }
        onMouseUp={ this.handleMouseUp }
        onMouseMove={ this.handleMouseMove }
        onMouseLeave={ this.handleMouseLeave }
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
