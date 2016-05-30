import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import yaForm from './modules';

const reducers = combineReducers({ yaForm });

const configureStore = (initialState = {}) =>
  createStore(reducers, initialState, compose(
      applyMiddleware(thunk)
  ));

export default configureStore;
