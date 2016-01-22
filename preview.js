import React, { PropTypes, Component } from 'react';

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

export default class PureCropperPreview extends Component {
  static propTypes = {
    originalURL: PropTypes.string.isRequired,
    cropArea: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    style: PropTypes.object
  }

  render() {
    const {
      originalURL,
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
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: `${originX}px ${originY}px`
    };

    const containerStyle = {
      ...style,
      overflow: 'hidden'
    };

    return (
      <div style={ containerStyle }>
        <img src={ originalURL } style={ imageStyle } />
      </div>
    );
  }
}
