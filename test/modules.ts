import chai, { expect } from 'chai';
import configureStore from '../src/redux/configureStore';
import reducer, { createForm } from '../src/redux/modules';

const store = configureStore();
const dispatch = store.dispatch;
const getState = () => store.getState().yaForm;

describe('Store', () => {
  it('can create a form', () => {
    dispatch(createForm('foo'));
    expect(getState()).to.deep.equal({
      'foo': {}
    });
  });

  it('can create a form with fields', () => {
    dispatch(createForm('foo', {
      fields: {
        'bar': {
          value: 'value1'
        }
      }
    }));
    expect(getState()).to.deep.equal({
      'foo': {
        fields: {
          'bar': {
            value: 'value1'
          }
        }
      }
    });
  });
});
