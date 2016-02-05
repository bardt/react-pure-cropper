import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

export const getScale = (previewSize, cropArea) => {
  return previewSize.width / cropArea.width;
};

export const getOrigin = (cropArea) => {
  return {
    x: cropArea.left + cropArea.width / 2,
    y: cropArea.top + cropArea.height / 2
  };
};

export const getTransformations = (cropArea, containerSize) => {
  const scale = getScale(containerSize, cropArea);
  const origin = getOrigin(cropArea);

  // Move crop area center into container center
  const translateX = containerSize.width / 2 - origin.x;
  const translateY = containerSize.height / 2 - origin.y;

  return {
    originX: origin.x,
    originY: origin.y,
    translateX,
    translateY,
    scale
  };
};

export default class PureCropperPreview extends PureComponent {
  static propTypes = {
    originalImage: PropTypes.string.isRequired,
    cropArea: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    style: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    const {
      originalImage,
      cropArea,
      style = {}
    } = this.props;

    const {
      originX,
      originY,
      translateX,
      translateY,
      scale
    } = getTransformations(cropArea, style);

    const imageStyle = {
      willChange: 'transform',
      pointerEvents: 'none',
      transform: `
        translate3d(
          ${translateX}px,
          ${translateY}px,
          0px
        )
        scale(${scale})
      `,
      msTransform: `
        translateX(${translateX}px)
        translateY(${translateY}px)
        scale(${scale})
      `,
      transformOrigin: `${originX}px ${originY}px`,
      msTransformOrigin: `${originX}px ${originY}px`
    };

    const containerStyle = {
      pointerEvents: 'none',
      overflow: 'hidden',
      ...style
    };

    return (
      <div style={ containerStyle }>
        <img src={ originalImage } style={ imageStyle } />
      </div>
    );
  }
}
