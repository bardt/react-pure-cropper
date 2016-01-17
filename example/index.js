import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper from '../index.js';
import PureCropperPreview from '../preview';

class CropperDemo extends Component {
  render() {
    const cropArea = {
      top: 10,
      left: 20,
      width: 70,
      height: 100
    };

    return (
      <div>
        <PureCropperPreview
          style={
            { width: 80 }
          }
          cropArea={ cropArea }
          originalURL="http://fengyuanchen.github.io/cropper/img/picture.jpg"
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
