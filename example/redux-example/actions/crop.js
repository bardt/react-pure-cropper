export const CHANGE_CROP = 'CHANGE_CROP';

export function changeCrop(crop) {
  return {
    type: CHANGE_CROP,
    crop
  };
}
