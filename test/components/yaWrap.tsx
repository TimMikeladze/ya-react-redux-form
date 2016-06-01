import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import yaWrap from '../../src/components/yaWrap';
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
    )
  }
};

describe('WrappedField', () => {
  it('does something', () => {
    const wrapper = mount(yaWrap(<Field value='foo'/>));
  });
});
