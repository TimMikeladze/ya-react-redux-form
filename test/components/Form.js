/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Form, configureStore, YaFormConfig } from '../../src/';

describe('Form', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
    YaFormConfig.setStore(store);
  });

  it('should render a form element with a default class', () => {
    const wrapper = mount(<Form name="form" />);
    expect(wrapper.find('.ya-react-form')).to.have.length(1);
  });
  it('accepts a className prop', () => {
    const wrapper = mount(<Form name="form" className="custom-class" />);
    expect(wrapper.find('.custom-class')).to.have.length(1);
  });
});
