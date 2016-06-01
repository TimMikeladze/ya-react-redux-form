import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import yaWrap from '../../src/components/yaWrap';
import Form from '../../src/components/Form';
import * as jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;
(global as any).document = doc;
(global as any).window = win;

class Field extends React.Component<any, any> {
  public render() {
    return (
      <div>
      </div>
    );
  }
};

describe('WrappedField', () => {
  it('does something', () => {
    //const wrapper = mount(yaWrap(<Field name='field1' value='value1' form='form1'/>));
  });
  it ('must be rendered within a form context or provided a form prop', () => {
    expect(() => mount(yaWrap(<Field name='field1' />)))
      .to.throw('A form prop or a form context type must be provided to YaWrap');

      expect(() => mount(yaWrap(<Field name='field1' form='form1'/>))).to.be.ok;

      const yaWrappedField = yaWrap(<Field name='field1'/>);
      expect(() => mount(
        <Form name='form1'>
          { mount(yaWrappedField) }
        </Form>
      )).to.be.ok;
  });
});
