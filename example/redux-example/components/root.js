import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Cropper from './cropper';
import { changeCrop } from '../actions/crop';
import Preview from './preview';

function select(state) {
  return {
    crop: state.crop.crop
  };
}

export class Root extends Component {
  static propTypes = {
    crop: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.handleCropChange = this::this.handleCropChange;
  }

  handleCropChange(crop) {
    this.props.dispatch(changeCrop(crop));
  }

  render() {
    const { crop } = this.props;
    return (
      <div>
        <Cropper
          crop={ crop }
          originalImage="http://fengyuanchen.github.io/cropper/img/picture.jpg"
          onCrop={ this.handleCropChange }
        />
        <Preview
          crop={ crop }
          originalImage="http://fengyuanchen.github.io/cropper/img/picture.jpg"
        />
      </div>
    );
  }
}

export default connect(select)(Root);
