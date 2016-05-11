import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import yaForm from './modules';

const logger = createLogger();

const reducers = combineReducers({ yaForm });

const configureStore = (initialState = {}) =>
  createStore(reducers, initialState, compose(
      applyMiddleware(thunk, logger)
  ));

export default configureStore;
