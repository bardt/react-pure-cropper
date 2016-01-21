import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper from '../index.js';
import PureCropperPreview from '../preview';

class CropperDemo extends Component {
  render() {
    const url = 'http://fengyuanchen.github.io/cropper/img/picture.jpg';

    const cropArea = {
      left: 700,
      top: 100,
      width: 400,
      height: 400
    };

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
        <PureCropper
          originalImage="http://fengyuanchen.github.io/cropper/img/picture.jpg"
          cropArea={ cropArea }
        />
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
