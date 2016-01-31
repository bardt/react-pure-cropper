import test from 'ava';
import 'babel-core/register';
import deepFreeze from 'deep-freeze';

import { unsafeZoom } from '../../src/cropper/calculations';

test('Unsafe Zoom: zooms according to aspect ratio', t => {
  const cropArea = deepFreeze({
    top: 200,
    left: 300,
    width: 500,
    height: 250
  });

  const expected = {
    top: 198,
    left: 295,
    width: 510,
    height: 255
  };

  const zoomedArea = unsafeZoom(cropArea, 2, 10);

  t.same(zoomedArea, expected);
});
