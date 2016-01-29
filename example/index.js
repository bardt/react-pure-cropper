import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper, { zoom, normalizeArea } from '../src/cropper';
import PureCropperPreview from '../src/preview';

class CropperDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropArea: {
        left: 700,
        top: 100,
        width: 400,
        height: 400
      }
    };

    const { width, height } = this.state.cropArea;

    this.aspectRatio = width / height;
    this.zoomIn = this::this.zoomIn;
    this.zoomOut = this::this.zoomOut;
  }

  zoom(amount) {
    const { cropArea } = this.state;
    const newCropArea = zoom(cropArea, this.aspectRatio, amount, { width: 1280, height: 720 });
    // console.log(JSON.stringify(newCropArea, null, 4), JSON.stringify(cropArea, null, 4));
    this.setState({
      // @TODO: Get original image size somehow
      cropArea: newCropArea
    });
  }

  zoomIn() {
    this.zoom(-1);
  }

  zoomOut() {
    this.zoom(1);
  }

  drag(event) {
    const { cropArea } = this.state;
    const newCropArea = normalizeArea({
      ...cropArea,
      left: cropArea.left - event.diffX,
      top: cropArea.top - event.diffY
    }, this.aspectRatio, { width: 1280, height: 720 });
    // console.log(JSON.stringify(newCropArea, null, 4), JSON.stringify(cropArea, null, 4));
    this.setState({
      // @TODO: Get original image size somehow
      cropArea: newCropArea
    });
  }

  render() {
    const url = 'http://fengyuanchen.github.io/cropper/img/picture.jpg';
    const { cropArea } = this.state;

    return (
      <div>
        <PureCropperPreview
          style={
            { width: 200, height: 200 }
          }
          cropArea={ cropArea }
          originalURL={ url }
        />
        <PureCropperPreview
          style={
            { width: 100, height: 100 }
          }
          cropArea={ cropArea }
          originalURL={ url }
        />
        <button onClick={ this.zoomOut }>-</button>
        <button onClick={ this.zoomIn }>+</button>
        <PureCropper
          originalImage={ url }
          cropArea={ cropArea }
          style={
            {
              width: 500,
              height: 1000
            }
          }
          aspectRatio={ this.aspectRatio }
          onZoom={ this::this.zoom }
          onDrag={ this::this.drag}
        />
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
