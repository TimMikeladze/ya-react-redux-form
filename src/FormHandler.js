import FormRegistry from './FormRegistry';
import { submitForm } from './redux/modules';
import _ from 'lodash';

const isFunction = (func) => {
  if (!_.isFunction(func)) {
    throw new Error('Expected a function');
  }
};

const runCallbacks = (callbacks, result, args) => {
  let callbackResult = result;
  if (Array.isArray) {
    callbacks.forEach(value => {
      callbackResult = value(callbackResult, args);
    });
  }
  return callbackResult;
};

class FormHandler {
  constructor({ dispatch, getState, name }) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.name = name;
    this.onSubmit = [];
    this.onSuccess = [];
    this.onFailure = [];
  }
  addOnSubmit(onSubmit) {
    isFunction(onSubmit);
    this.onSubmit.push(onSubmit);
  }
  addOnSuccess(onSuccess) {
    isFunction(onSuccess);
    this.onSuccess.push(onSuccess);
  }
  addOnFailure(onFailure) {
    isFunction(onFailure);
    this.onFailure.push(onFailure);
  }
  setMethod(method) {
    isFunction(method);
    this.method = method;
  }
  submit() {
    const promise = new Promise((resolve, reject) => {
     // Create an object from the current state containg a mapping between field names and values.
      const form = FormHandler.extractForm(this.name, this.getState);
      this.dispatch(submitForm(form));

      const args = {
        name: this.name,
        form,
        dispatch: this.dispatch,
        getState: this.getState,
      };

      const onSubmitResult = runCallbacks(this.onSubmit, undefined, args);

      if (onSubmitResult !== undefined) {
        runCallbacks(this.onFailure, onSubmitResult, args);
      } else if (this.method) {
        Promise.resolve(this.method(args)).then(result => {
          runCallbacks(this.onSuccess, result, args);
          resolve({ result, args });
        }, err => {
          runCallbacks(this.onFailure, err, args);
          reject({ err, args });
        });
      } else {
        runCallbacks(this.onSuccess, undefined, args);
        resolve({ result: undefined, args });
      }
    });

    return promise;
  }
}

FormHandler.getFormError = (name, state) => {
  let form;
  if (!state) {
    const handler = FormRegistry.get(name);
    form = handler.getState().yaForm;
  } else {
    form = state.yaForm;
  }
  return _.has(form, `${name}.error`) ? form[name].error : null;
};

FormHandler.getFieldError = (name, field, state) => {
  let form;
  if (!state) {
    const handler = FormRegistry.get(name);
    form = handler.getState().yaForm;
  } else {
    form = state.yaForm;
  }

  return _.has(form, `${name}.fields.${field}.error`) ? form[name].fields[field].error : null;
};

FormHandler.submit = (name) => FormRegistry.instance.get(name).submit();

FormHandler.extractForm = (name, getState) => {
  const formState = getState().yaForm[name];
  const obj = {};
  if (formState.hasOwnProperty('fields')) {
    const fields = formState.fields;
    for (const key in fields) {
      if (key) {
        obj[key] = fields[key].value;
      }
    }
  }
  return obj;
};

export default FormHandler;
