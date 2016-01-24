import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper, { zoom } from '../index.js';
import PureCropperPreview from '../preview';

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
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  zoom(amount) {
    const { cropArea } = this.state;
    this.setState({
      cropArea: zoom(cropArea, amount, { width: 1280, height: 720 })
    });
  }

  zoomIn() {
    this.zoom(-1);
  }

  zoomOut() {
    this.zoom(1);
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
        />
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
