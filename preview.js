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
      style = {}
    } = this.props;

    return (
      <div style={ style }>
        <img src={ originalURL } />
      </div>
    );
  }
}
