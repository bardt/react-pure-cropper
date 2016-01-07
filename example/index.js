import React, { Component } from 'react';
import { render } from 'react-dom';
import PureCropper from '../index.js';

class CropperDemo extends Component {
  render() {
    const cropArea = {
      top: 10,
      left: 20,
      width: 100,
      height: 200
    };

    return (
      <div>
        <PureCropper
          originalImage="http://fengyuanchen.github.io/cropper/img/picture.jpg"
          cropArea={ cropArea }
        />
      </div>
    );
  }
}

render(<CropperDemo/>, document.querySelector('app'));
