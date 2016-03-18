import React from 'react';
import PureCropperPreview from '../../../src/preview';

const previewStyle = {
  borderRadius: '50%',
  border: '1px solid black'
};

export default function ({ crop, originalImage }) {
  return (
    <PureCropperPreview
      style={{ ...previewStyle, width: 200, height: 200 }}
      cropArea={ crop }
      originalImage={ originalImage }
    />
  );
}
