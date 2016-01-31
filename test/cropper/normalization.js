import test from 'ava';
import 'babel-core/register';
import deepFreeze from 'deep-freeze';

import { normalizeArea } from '../../src/cropper/calculations';

const originalImageSize = deepFreeze({
  width: 1280,
  height: 720
});

test('Normalization: Valid area does not change after normalization', t => {
  const validCropArea = deepFreeze({
    left: 200,
    top: 200,
    width: 1000,
    height: 500
  });

  const normalizedCropArea = normalizeArea(validCropArea, 2, originalImageSize);

  t.same(normalizedCropArea, validCropArea);
});

test('Normalization: Invalid size area becomes valid', t => {
  const invalidSizeCropArea = deepFreeze({
    left: 0,
    top: 0,
    width: 2000,
    height: 1000
  });

  const expected = {
    left: 0,
    top: 0,
    width: 1280,
    height: 640
  };

  const normalizedCropArea = normalizeArea(invalidSizeCropArea, 2, originalImageSize);

  t.same(normalizedCropArea, expected);
});

test('Normalization: Valid size area outside of image moves inside', t => {
  const invalidPositionCropArea = deepFreeze({
    left: -20,
    top: -40,
    width: 500,
    height: 250
  });

  const expected = {
    left: 0,
    top: 0,
    width: 500,
    height: 250
  };

  const normalizedCropArea = normalizeArea(invalidPositionCropArea, 2, originalImageSize);

  t.same(normalizedCropArea, expected);
});

test('Normalization: Crop area can not be less than default minimum', t => {
  const cropArea = deepFreeze({
    top: 719,
    left: 1279,
    height: 0,
    width: 0
  });

  const expected = {
    top: 719,
    left: 1279,
    height: 1,
    width: 1
  };

  const normalizedCropArea = normalizeArea(cropArea, 1, originalImageSize);

  t.same(normalizedCropArea, expected);
});
