import test from 'ava';
import 'babel-core/register';
import deepFreeze from 'deep-freeze';

import { normalizeArea } from '../src/cropper';

const originalImageSize = deepFreeze({
  width: 1280,
  height: 720
});

test('Valid area does not change after normalization', t => {
  const validCropArea = deepFreeze({
    left: 200,
    top: 200,
    width: 1000,
    height: 500
  });

  const normalizedCropArea = normalizeArea(validCropArea, originalImageSize);

  t.same(normalizedCropArea, validCropArea);
});

test('Invalid size area becomes valid', t => {
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

  const normalizedCropArea = normalizeArea(invalidSizeCropArea, originalImageSize);

  t.same(normalizedCropArea, expected);
});

test('Valid size area outside of image moves inside', t => {
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

  const normalizedCropArea = normalizeArea(invalidPositionCropArea, originalImageSize);

  t.same(normalizedCropArea, expected);
});
