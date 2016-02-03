const noop = () => undefined;

export function throttle(fn, threshhold = 250, scope) {
  let last;
  let deferTimer;

  return function throttled() {
    const context = scope || this;

    const now = +new Date;
    const args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

export const getImageSize = (src, callback = noop) => {
  const img = new Image();
  img.src = src;

  img.onload = function() {
    const { width, height } = img;
    callback({
      width,
      height
    });
  }
}
