import { expect } from 'chai';
import { configureStore, YaForm } from '../../src/';
import {
  createForm, removeForm, addField, removeField, changeField,
  setFormError, setFieldError, clearFormError, clearFieldError,
} from '../../src/redux/modules';


describe('redux state', () => {
  let store;
  let dispatch;
  let getState;

  beforeEach(() => {
    store = configureStore();
    dispatch = store.dispatch;
    getState = () => store.getState().yaForm;
  });

  describe('actions', () => {
    it('can create a form', () => {
      dispatch(createForm('form1'));
      expect(getState()).to.deep.equal({
        form1: {},
      });
    });

    it('can create two forms', () => {
      dispatch(createForm('form1'));
      dispatch(createForm('form2'));
      expect(getState()).to.deep.equal({
        form1: {},
        form2: {},
      });
    });

    it('can create a form with fields', () => {
      dispatch(createForm('form1', {
        fields: {
          field1: {
            value: 'value1',
          },
        },
      }));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
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
        form2: {},
      });
    });

    it('can add a field', () => {
      dispatch(createForm('form1'));
      dispatch(addField('form1', 'field1'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: '',
            },
          },
        },
      });
    });

    it('it can add a field to form which does not exist by creating', () => {
      dispatch(addField('form1', 'field1'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: '',
            },
          },
        },
      });
    });

    it('can add a field with values', () => {
      dispatch(createForm('form1'));
      dispatch(addField('form1', 'field1'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: '',
            },
          },
        },
      });
    });

    it('can remove a field', () => {
      dispatch(createForm('form1'));
      dispatch(addField('form1', 'field1'));
      dispatch(addField('form1', 'field2'));
      dispatch(removeField('form1', 'field1'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field2: {
              value: '',
            },
          },
        },
      });
    });

    it('throws an error if removing a field that does not exist', () => {
      dispatch(createForm('form1'));
      expect(() => dispatch(removeField('form1', 'field1')))
      .to.throw('field1 does not exist in form1');
    });

    it('can change a field value', () => {
      dispatch(createForm('form1'));
      dispatch(addField('form1', 'field1'));
      dispatch(changeField('form1', 'field1', {
        value: 'value1',
      }));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value1',
            },
          },
        },
      });
    });

    it('can change a field value which does not exist by creating it', () => {
      dispatch(createForm('form1'));
      dispatch(changeField('form1', 'field1', {
        value: 'value1',
      }));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value1',
            },
          },
        },
      });
    });

    it('can set a form error', () => {
      dispatch(createForm('form1'));
      dispatch(setFormError('form1', 'error'));
      expect(getState()).to.deep.equal({
        form1: {
          error: 'error',
        },
      });
    });

    it('can clear a form error', () => {
      dispatch(createForm('form1'));
      dispatch(setFormError('form1', 'error'));
      dispatch(clearFormError('form1'));
      expect(getState()).to.deep.equal({
        form1: {
        },
      });
    });

    it('can set a field error', () => {
      dispatch(createForm('form1', {
        fields: {
          field1: {
            value: 'value1',
          },
        },
      }));
      dispatch(setFieldError('form1', 'field1', 'error'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value1',
              error: 'error',
            },
          },
        },
      });
    });

    it('can clear a field error', () => {
      dispatch(createForm('form1', {
        fields: {
          field1: {
            value: 'value1',
          },
        },
      }));
      dispatch(setFieldError('form1', 'field1', 'error'));
      dispatch(clearFieldError('form1', 'field1'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value1',
            },
          },
        },
      });
    });

    it('can preserve error on field change', () => {
      dispatch(createForm('form1', {
        fields: {
          field1: {
            value: 'value1',
          },
        },
      }));
      dispatch(setFieldError('form1', 'field1', 'error'));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value1',
              error: 'error',
            },
          },
        },
      });
      dispatch(changeField('form1', 'field1', {
        value: 'value2',
      }, true));
      expect(getState()).to.deep.equal({
        form1: {
          fields: {
            field1: {
              value: 'value2',
              error: 'error',
            },
          },
        },
      });
    });
  });

  describe('YaForm helpers', () => {
    beforeEach(() => {
      dispatch(createForm('form1', {
        fields: {
          field1: {
            value: 'value1',
            error: 'fieldError1',
          },
        },
        error: 'formError1',
      }));
    });

    it('getFormError', () => {
      expect(YaForm.getFormError(store.getState(), 'form1')).to.equal('formError1');
    });

    it('hasFormError', () => {
      expect(YaForm.hasFormError(store.getState(), 'form1')).to.equal(true);
      dispatch(clearFormError('form1'));
      expect(YaForm.hasFormError(store.getState(), 'form1')).to.equal(false);
    });

    it('getFieldError', () => {
      expect(YaForm.getFieldError(store.getState(), 'form1', 'field1')).to.equal('fieldError1');
    });

    it('hasFieldError', () => {
      expect(YaForm.hasFieldError(store.getState(), 'form1', 'field1')).to.equal(true);
      dispatch(clearFieldError('form1', 'field1'));
      expect(YaForm.hasFieldError(store.getState(), 'form1', 'field1')).to.equal(false);
    });
  });
});
