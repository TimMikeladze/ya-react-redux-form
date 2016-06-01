import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Form from '../../src/components/Form';

describe('Form', () => {
  it('should render a form element with a default class', () => {
    const wrapper = shallow(<Form name='form1' />);
    expect(wrapper.find('.ya-react-form')).to.exist;
  });
});
