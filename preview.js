import React, { PropTypes, Component } from 'react';

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

    const scale = style.width / cropArea.width;
    const cropAreaCenter = {
      x: cropArea.left + cropArea.width / 2,
      y: cropArea.top + cropArea.height / 2
    };

    // Move crop area center into container center
    const translateX = -cropAreaCenter.x + style.width / 2;
    const translateY = -cropAreaCenter.y + style.height / 2;

    const imageStyle = {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: `${cropAreaCenter.x}px ${cropAreaCenter.y}px`
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
