'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _component = require('react-pure-render/component');

var _component2 = _interopRequireDefault(_component);

var _preview = require('../preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BACKGROUND_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAFJJREFUSA3t0rENwCAMBVFgRy9pD+m0dCen5VIR6STE09+ZuSZfREzydUb1j9gLEE0iiVAAA1f0ANHubnzmHVTV/YtnVyQRCmDgiiRCAQxcERJ9bYcIOvgMZL8AAAAASUVORK5CYII='; // eslint-disable-line max-len

var PureCropper = function (_PureComponent) {
  _inherits(PureCropper, _PureComponent);

  function PureCropper(props) {
    _classCallCheck(this, PureCropper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PureCropper).call(this, props));

    _this.handleMouseWheel = _this.handleMouseWheel.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    return _this;
  }

  _createClass(PureCropper, [{
    key: 'countSelectionArea',
    value: function countSelectionArea() {
      var _props = this.props;
      var aspectRatio = _props.aspectRatio;
      var style = _props.style;

      var holderAspectRatio = style.width / style.height;

      function gatherAreaSize(containerSize, ratio) {
        var width = containerSize.width * 0.6;
        var left = (containerSize.width - width) / 2;
        var height = width / ratio;
        var top = (containerSize.height - height) / 2;
        return {
          width: width,
          height: height,
          left: left,
          top: top
        };
      }

      if (aspectRatio >= holderAspectRatio) {
        return gatherAreaSize(style, aspectRatio);
      }

      var countedArea = gatherAreaSize({
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
  }, {
    key: 'handleMouseWheel',
    value: function handleMouseWheel(event) {
      event.preventDefault();

      var deltaX = event.deltaX;
      var deltaY = event.deltaY;

      var significantDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

      this.props.onZoom(significantDelta);
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(event) {
      this.dragging = true;
      this.mouseCoords = {
        x: event.pageX,
        y: event.pageY
      };
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      this.dragging = false;
      this.mouseCoords = {};
    }
  }, {
    key: 'handleMouseLeave',
    value: function handleMouseLeave() {
      this.dragging = false;
      this.mouseCoords = {};
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {
      if (this.dragging) {
        event.preventDefault();

        var cropArea = this.props.cropArea;

        var scale = (0, _preview.getScale)(this.countSelectionArea(), cropArea);

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
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var cropArea = _props2.cropArea;
      var originalImage = _props2.originalImage;
      var style = _props2.style;


      var noSelectStyle = {
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        OUserSelect: 'none',
        userSelect: 'none'
      };

      var holderStyle = _extends({}, style, {
        background: 'url(' + BACKGROUND_IMAGE + ') repeat',
        position: 'relative',
        overflow: 'hidden'
      });

      var previewStyle = _extends({}, this.countSelectionArea(), {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid black'
      });

      var _getTransformations = (0, _preview.getTransformations)(cropArea, previewStyle);

      var originX = _getTransformations.originX;
      var originY = _getTransformations.originY;
      var scale = _getTransformations.scale;


      var backgroundStyle = _extends({}, noSelectStyle, {
        willChange: 'transform',
        pointerEvents: 'none',
        transformOrigin: originX + 'px ' + originY + 'px',
        msTransformOrigin: originX + 'px ' + originY + 'px',
        transform: '\n        translate3d(\n          ' + (holderStyle.width / 2 - originX) + 'px,\n          ' + (holderStyle.height / 2 - originY) + 'px,\n          0px\n        )\n        scale(' + scale + ')\n      ',
        msTransform: '\n        translateX(' + (holderStyle.width / 2 - originX) + 'px)\n        translateY(' + (holderStyle.height / 2 - originY) + 'px)\n        scale(' + scale + ')\n      '
      });

      var overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'black',
        opacity: 0.3,
        pointerEvents: 'none'
      };

      return _react2.default.createElement(
        'div',
        { style: holderStyle,
          onWheel: this.handleMouseWheel,
          onMouseDown: this.handleMouseDown,
          onMouseUp: this.handleMouseUp,
          onMouseMove: this.handleMouseMove,
          onMouseLeave: this.handleMouseLeave
        },
        _react2.default.createElement('img', {
          src: originalImage,
          style: backgroundStyle
        }),
        _react2.default.createElement('div', { className: 'overlay', style: overlayStyle }),
        _react2.default.createElement(_preview2.default, {
          cropArea: cropArea,
          originalImage: originalImage,
          style: previewStyle
        })
      );
    }
  }]);

  return PureCropper;
}(_component2.default);

PureCropper.propTypes = {
  // URL or data-url of image to be cropped
  originalImage: _react.PropTypes.string.isRequired,
  // Area in real pixels which is desired to be cropped
  cropArea: _react.PropTypes.object,
  // Visual selection position and size
  selectionPosition: _react.PropTypes.object,

  aspectRatio: _react.PropTypes.number.isRequired,

  style: _react.PropTypes.shape({
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }).isRequired,

  onZoom: _react.PropTypes.func,
  onDrag: _react.PropTypes.func
};
PureCropper.defaultProps = {
  onZoom: function onZoom() {
    return undefined;
  },
  onDrag: function onDrag() {
    return undefined;
  }
};
exports.default = PureCropper;