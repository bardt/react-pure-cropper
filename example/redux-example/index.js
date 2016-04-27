import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import Root from './components/root';

render(
  <Provider store={ configureStore() }>
    <Root />
  </Provider>, document.querySelector('app'));
