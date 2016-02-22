"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultMinSize = {
  width: 1,
  height: 1
};

var normalizeArea = exports.normalizeArea = function normalizeArea(cropArea, aspectRatio, originalSize) {
  var minSize = arguments.length <= 3 || arguments[3] === undefined ? defaultMinSize : arguments[3];
  var top = cropArea.top;
  var left = cropArea.left;
  var width = cropArea.width;
  var height = cropArea.height;

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

  if (left > originalSize.width - width) {
    left = originalSize.width - width;
  }

  if (top > originalSize.height - height) {
    top = originalSize.height - height;
  }

  return {
    top: top,
    left: left,
    height: height,
    width: width
  };
};

var unsafeZoom = exports.unsafeZoom = function unsafeZoom(cropArea, aspectRatio, zoomAmount) {
  var top = cropArea.top;
  var left = cropArea.left;
  var width = cropArea.width;
  var height = cropArea.height;


  var getSizes = function getSizes(significantSize) {
    var secondaryRatio = Math.min(aspectRatio, 1 / aspectRatio);

    return {
      main: significantSize + zoomAmount,
      secondary: (significantSize + zoomAmount) * secondaryRatio
    };
  };

  var sizes = aspectRatio >= 1 ? getSizes(width) : getSizes(height);

  var zoomedSize = {
    width: aspectRatio >= 1 ? sizes.main : sizes.secondary,
    height: aspectRatio >= 1 ? sizes.secondary : sizes.main
  };

  return _extends({}, zoomedSize, {
    left: left + Math.round((width - zoomedSize.width) / 2),
    top: top + Math.round((height - zoomedSize.height) / 2)
  });
};

var zoom = exports.zoom = function zoom(cropArea, aspectRatio, zoomAmount, originalImageSize, minSize) {
  return normalizeArea(unsafeZoom(cropArea, aspectRatio, zoomAmount), aspectRatio, originalImageSize, minSize);
};