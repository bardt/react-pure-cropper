import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper from '../src/cropper';
import { zoom, normalizeArea } from '../src/cropper/calculations';
import PureCropperPreview from '../src/preview';
import { getImageSize } from '../src/utils';


import Perf from 'react-addons-perf';
window.Perf = Perf;

class CropperDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropArea: {
        left: 700,
        top: 100,
        width: 400,
        height: 400
      },
      originalSize: {
        width: 0,
        height: 0
      },
      url: 'http://fengyuanchen.github.io/cropper/img/picture.jpg'
    };

    const { width, height } = this.state.cropArea;
    this.state.aspectRatio = width / height;

    this.zoomIn = this::this.zoomIn;
    this.zoomOut = this::this.zoomOut;
    this.zoom = this::this.zoom;
    this.drag = this::this.drag;
  }

  componentDidMount() {
    const { url } = this.state;
    getImageSize(url, originalSize => {
      const { cropArea, aspectRatio } = this.state;
      this.setState({
        originalSize,
        cropArea: normalizeArea(cropArea, aspectRatio, originalSize)
      });
    });
  }

  zoom(amount) {
    const { cropArea, originalSize, aspectRatio } = this.state;
    const newCropArea = zoom(cropArea, aspectRatio, amount, originalSize);
    this.setState({
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
    const { cropArea, originalSize, aspectRatio } = this.state;

    const newCropArea = normalizeArea({
      ...cropArea,
      left: cropArea.left - event.diffX,
      top: cropArea.top - event.diffY
    }, aspectRatio, originalSize);

    this.setState({
      cropArea: newCropArea
    });
  }

  render() {
    const { cropArea, url, aspectRatio } = this.state;

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
            style={ { width: 500, height: 1000 } }
            originalImage={ url }
            cropArea={ cropArea }
            aspectRatio={ aspectRatio }
            onZoom={ this.zoom }
            onDrag={ this.drag }
          />
        </div>
        <div style={{
          float: 'left',
          width: 200,
          padding: '1em'
        }}
        >
          <PureCropperPreview
            style={ { width: 200, height: 200 } }
            cropArea={ cropArea }
            originalImage={ url }
          />
          <PureCropperPreview
            style={ { width: 100, height: 100 } }
            cropArea={ cropArea }
            originalImage={ url }
          />
        </div>
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
