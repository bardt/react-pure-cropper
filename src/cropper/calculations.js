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
