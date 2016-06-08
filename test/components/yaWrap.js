/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { yaWrap, Form, configureStore, YaFormConfig } from '../../src/';

class Field extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
      </div>
    );
  }
}

const WrappedField = (props) => yaWrap(<Field {...props} />);

describe('WrappedField', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
    YaFormConfig.setStore(store);
  });

  it('does something', () => {
    // const wrapper = mount(yaWrap(<Field name='field1' value='value1' form='form1'/>));
  });

  it('must be rendered within a form context or provided a form prop', () => {
    expect(() => mount(<WrappedField name="field1" />))
      .to.throw('A form prop or a form context type must be provided to YaWrap');

    expect(() => mount(<WrappedField name="field1" form="form1" />)).to.be.ok;

    expect(() => mount(
        <Form name="form1">
          <WrappedField name="field1" />
        </Form>
      )).to.be.ok;
  });
});
