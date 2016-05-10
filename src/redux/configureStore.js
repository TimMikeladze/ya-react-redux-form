import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './modules';

const logger = createLogger();

const configureStore = (initialState = {}) =>
  createStore(reducer, initialState, compose(
      applyMiddleware(thunk, logger)
  ));

export default configureStore;
