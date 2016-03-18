import React, { Component, PropTypes } from 'react';
import PureCropper from '../../../src/cropper';
import { zoom, normalizeArea } from '../../../src/cropper/calculations';
import { getImageSize } from '../../../src/utils';

const MIN_SIZE = {
  width: 100,
  height: 100
};

export default class Cropper extends Component {
  static propTypes = {
    onCrop: PropTypes.func.isRequired,
    crop: PropTypes.object.isRequired,
    originalImage: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props);
    const { width, height } = props.crop;

    this.state = {
      originalSize: {
        width: 0,
        height: 0
      },
      aspectRatio: width / height
    };

    this.zoomIn = this::this.zoomIn;
    this.zoomOut = this::this.zoomOut;
    this.zoom = this::this.zoom;
    this.drag = this::this.drag;
  }

  componentDidMount() {
    const { originalImage } = this.props;
    getImageSize(originalImage, originalSize => {
      const { aspectRatio } = this.state;
      const { crop, onCrop } = this.props;

      this.setState({
        originalSize
      }, () => {
        const nextCrop = normalizeArea(crop, aspectRatio, originalSize, MIN_SIZE);
        return onCrop(nextCrop);
      });
    });
  }

  zoom(amount) {
    const { originalSize, aspectRatio } = this.state;
    const { crop, onCrop } = this.props;
    const newCropArea = zoom(crop, aspectRatio, amount, originalSize, MIN_SIZE);

    onCrop(newCropArea);
  }

  zoomIn() {
    this.zoom(-1);
  }

  zoomOut() {
    this.zoom(1);
  }

  drag(event) {
    const { originalSize, aspectRatio } = this.state;
    const { crop, onCrop } = this.props;
    const newCropArea = normalizeArea({
      ...crop,
      left: crop.left - event.diffX,
      top: crop.top - event.diffY
    }, aspectRatio, originalSize, MIN_SIZE);

    onCrop(newCropArea);
  }

  render() {
    const { aspectRatio } = this.state;
    const { crop, originalImage } = this.props;
    const previewStyle = {
      borderRadius: '50%',
      border: '1px solid black'
    };
    return (
      <div>
        <div style={{
          float: 'left',
          width: 500,
          padding: '1em'
        }}
        >
          <button onClick={ this.zoomOut }>-</button>
          <button onClick={ this.zoomIn }>+</button>
          <PureCropper
            style={ { width: 500, height: 500 } }
            previewStyle={ previewStyle }
            originalImage={ originalImage }
            cropArea={ crop }
            aspectRatio={ aspectRatio }
            onZoom={ this.zoom }
            onDrag={ this.drag }
          />
        </div>
      </div>
    );
  }
}
