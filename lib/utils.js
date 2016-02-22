"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttle = throttle;
var noop = function noop() {
  return undefined;
};

function throttle(fn) {
  var threshhold = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];
  var scope = arguments[2];

  var last = undefined;
  var deferTimer = undefined;

  return function throttled() {
    var context = scope || this;

    var now = +new Date();
    var args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

var getImageSize = exports.getImageSize = function getImageSize(src) {
  var callback = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

  var img = new Image();
  img.src = src;

  img.onload = function () {
    var width = img.width;
    var height = img.height;

    callback({
      width: width,
      height: height
    });
  };
};