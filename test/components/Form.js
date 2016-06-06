/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Form from '../../src/components/Form';
import configureStore from '../../src/redux/configureStore';
import YaFormConfig from '../../src/YaFormConfig';

import * as jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;
global.document = doc;
global.window = win;


describe('Form', () => {
  let store;
  let dispatch;
  let getState;

  beforeEach(() => {
    store = configureStore();
    dispatch = store.dispatch;
    getState = () => store.getState().yaForm;
    YaFormConfig.setStore(store);
  });

  it('should render a form element with a default class', () => {
  });
});
