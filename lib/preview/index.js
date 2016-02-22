'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransformations = exports.getOrigin = exports.getScale = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _component = require('react-pure-render/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getScale = exports.getScale = function getScale(previewSize, cropArea) {
  return previewSize.width / cropArea.width;
};

var getOrigin = exports.getOrigin = function getOrigin(cropArea) {
  return {
    x: cropArea.left + cropArea.width / 2,
    y: cropArea.top + cropArea.height / 2
  };
};

var getTransformations = exports.getTransformations = function getTransformations(cropArea, containerSize) {
  var scale = getScale(containerSize, cropArea);
  var origin = getOrigin(cropArea);

  // Move crop area center into container center
  var translateX = containerSize.width / 2 - origin.x;
  var translateY = containerSize.height / 2 - origin.y;

  return {
    originX: origin.x,
    originY: origin.y,
    translateX: translateX,
    translateY: translateY,
    scale: scale
  };
};

var PureCropperPreview = function (_PureComponent) {
  _inherits(PureCropperPreview, _PureComponent);

  function PureCropperPreview() {
    _classCallCheck(this, PureCropperPreview);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PureCropperPreview).apply(this, arguments));
  }

  _createClass(PureCropperPreview, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var originalImage = _props.originalImage;
      var cropArea = _props.cropArea;
      var _props$style = _props.style;
      var style = _props$style === undefined ? {} : _props$style;

      var _getTransformations = getTransformations(cropArea, style);

      var originX = _getTransformations.originX;
      var originY = _getTransformations.originY;
      var translateX = _getTransformations.translateX;
      var translateY = _getTransformations.translateY;
      var scale = _getTransformations.scale;


      var imageStyle = {
        willChange: 'transform',
        pointerEvents: 'none',
        transform: '\n        translate3d(\n          ' + translateX + 'px,\n          ' + translateY + 'px,\n          0px\n        )\n        scale(' + scale + ')\n      ',
        msTransform: '\n        translateX(' + translateX + 'px)\n        translateY(' + translateY + 'px)\n        scale(' + scale + ')\n      ',
        transformOrigin: originX + 'px ' + originY + 'px',
        msTransformOrigin: originX + 'px ' + originY + 'px'
      };

      var containerStyle = _extends({
        pointerEvents: 'none',
        overflow: 'hidden'
      }, style);

      return _react2.default.createElement(
        'div',
        { style: containerStyle },
        _react2.default.createElement('img', { src: originalImage, style: imageStyle })
      );
    }
  }]);

  return PureCropperPreview;
}(_component2.default);

PureCropperPreview.propTypes = {
  originalImage: _react.PropTypes.string.isRequired,
  cropArea: _react.PropTypes.shape({
    top: _react.PropTypes.number.isRequired,
    left: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }),
  style: _react.PropTypes.shape({
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }).isRequired
};
exports.default = PureCropperPreview;