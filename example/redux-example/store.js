import { createStore } from 'redux';
import cropReducer from './reducers/index';

export function configureStore(initialState = {}) {
  return createStore(cropReducer, initialState);
}
