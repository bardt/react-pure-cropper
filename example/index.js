import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper from '../src/cropper';
import { zoom, normalizeArea } from '../src/cropper/calculations';
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
      },
      scale: 1
    };

    const { width, height } = this.state.cropArea;

    this.aspectRatio = width / height;
    this.zoomIn = this::this.zoomIn;
    this.zoomOut = this::this.zoomOut;
  }

  zoom(amount) {
    const { cropArea } = this.state;
    const newCropArea = zoom(cropArea, this.aspectRatio, amount, { width: 1280, height: 720 });
    this.setState({
      // @TODO: Get original image size somehow
      cropArea: newCropArea
    });
  }

  zoomIn() {
    this.setState({
      scale: this.state.scale + 0.1
    })
    // this.zoom(-1);
  }

  zoomOut() {
    this.setState({
      scale: this.state.scale - 0.1
    })
    // this.zoom(1);
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
      cropArea: newCropArea
    });
  }

  render() {
    const url = 'http://fengyuanchen.github.io/cropper/img/picture.jpg';
    const { cropArea } = this.state;
    const style = {
      width: `${1280}`,
      height: `${720}`,
      transform: `scale(${this.state.scale})`
      // backgroundImage: `url(${url})`,
      // backgroundSize: 'cover'
    };

    return (
      <div>
        <button onClick={ this.zoomOut }>-</button>
        <button onClick={ this.zoomIn }>+</button>
        <img src={ url } style={ style }/>
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
