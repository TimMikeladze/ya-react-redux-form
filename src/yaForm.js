import { submitForm } from './redux/modules';

class YaForm {
  constructor(dispatch, state) {
    this.dispatch = dispatch;
    this.state = state;
  }
  setValidator(validator) {
    this.validator = validator;
    return this;
  }
  setMethod(method) {
    this.method = method;
    return this;
  }
  setOnSubmit(onSubmit) {
    this.onSubmit = onSubmit;
    return this;
  }
  setOnSuccess(onSuccess) {
    this.onSuccess = onSuccess;
    return this;
  }
  setOnFailure(onFailure) {
    this.onFailure = onFailure;
    return this;
  }
  setOnValidation(onValidation) {
    this.onValidation = onValidation;
    return this;
  }
  setSchema(schema) {
    this.schema = schema;
    return this;
  }
  submit(name) {
    this.dispatch(submitForm(name));

    const promise = new Promise((resolve, reject) => {
     // Create an object from the current state containg a mapping between field names and values.
      const form = (() => {
        const formState = this.state.yaForm[name];
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
      })();

      const baseCallbackArgs = {
        name,
        form,
        schema: this.schema,
        dispatch: this.dispatch,
        state: this.state,
      };

     // Run onSubmit
      if (this.onSubmit) {
        const err = this.onSubmit(baseCallbackArgs);
        if (err) {
          this.onFailure(err, baseCallbackArgs);
          reject(Object.assign({}, err, baseCallbackArgs));
        }
      }

     // Validator the form
      if (this.validator) {
        const err = this.validator(baseCallbackArgs);
        if (err) {
          this.onFailure(err, baseCallbackArgs);
          reject(Object.assign({}, err, baseCallbackArgs));
        }
      }

      if (this.method) {
       // Promisify the callback results
        Promise.resolve(this.method(baseCallbackArgs)).then(result => {
          if (this.onSuccess) {
            this.onSuccess(result, baseCallbackArgs);
          }
          resolve(Object.assign({}, result, baseCallbackArgs));
        }).catch(err => {
          if (this.onFailure) {
            this.onFailure(err, baseCallbackArgs);
          }
          reject(Object.assign({}, err, baseCallbackArgs));
        });
      } else {
        if (this.onSuccess) {
          this.onSuccess(baseCallbackArgs);
        }
      }
    });

    return promise;
  }
}

YaForm.hasFormError = (state, form) => !!YaForm.getFormError(state, form);

/* eslint-disable max-len */
YaForm.getFormError = (state, form) => state.yaForm.hasOwnProperty(form) // eslint-disable-line no-confusing-arrow
  && state.yaForm[form].hasOwnProperty('error') ? state.yaForm[form].error : undefined;

YaForm.hasFieldError = (state, form, field) => !!YaForm.getFieldError(state, form, field);

YaForm.getFieldError = (state, form, field) => state.yaForm.hasOwnProperty(form) // eslint-disable-line no-confusing-arrow
  && state.yaForm[form].hasOwnProperty('fields')
  && state.yaForm[form].fields.hasOwnProperty(field)
  && state.yaForm[form].fields[field].hasOwnProperty('error')
  ? state.yaForm[form].fields[field].error : undefined;


export default YaForm;
