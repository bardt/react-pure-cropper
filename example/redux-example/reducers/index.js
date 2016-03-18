import { combineReducers } from 'redux';
import { CHANGE_CROP } from '../actions/crop';

const initialState = {
  left: 700,
  top: 100,
  width: 400,
  height: 400
};

export function crop(state = {
  crop: initialState
}, action) {
  switch (action.type) {
    case CHANGE_CROP:
      return {
        crop: action.crop
      };
    default:
      return state;
  }
}

export default combineReducers({ crop });
