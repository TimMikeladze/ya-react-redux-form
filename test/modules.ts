import { expect } from 'chai';
import configureStore from '../src/redux/configureStore';
import { createForm, removeForm } from '../src/redux/modules';


describe('Store', () => {
  let store, dispatch, getState;

  beforeEach(() => {
    store = configureStore();
    dispatch = store.dispatch;
    getState = () => store.getState().yaForm;
  });

  it('can create a form', () => {
    dispatch(createForm('form1'));
    expect(getState()).to.deep.equal({
      'form1': {},
    });
  });

  it('can create two forms', () => {
    dispatch(createForm('form1'));
    dispatch(createForm('form2'));
    expect(getState()).to.deep.equal({
      'form1': {},
      'form2': {},
    });
  });

  it('can create a form with fields', () => {
    dispatch(createForm('form1', {
      fields: {
        'field1': {
          value: 'value1',
        },
      },
    }));
    expect(getState()).to.deep.equal({
      'form1': {
        fields: {
          'field1': {
            value: 'value1',
          },
        },
      },
    });
  });

  it('can remove a form', () => {
    dispatch(createForm('form1'));
    dispatch(createForm('form2'));
    dispatch(removeForm('form1'));
    expect(getState()).to.deep.equal({
      'form2': {},
    });
  })

  it('can add a field', () => {

  });

  it('can remove a field', () => {

  })
});
