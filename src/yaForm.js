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

      const args = {
        name,
        form,
        schema: this.schema,
        dispatch: this.dispatch,
        state: this.state,
      };

     // Run onSubmit
      if (this.onSubmit instanceof Function) {
        const err = this.onSubmit(args);
        if (err) {
          this.onFailure(err, args);
          reject({ err, args });
        }
      }

     // Validator the form
      if (this.validator instanceof Function) {
        const err = this.validator(args);
        if (err) {
          this.onFailure(err, args);
          reject({ err, args });
        }
      }

      if (this.method instanceof Function) {
       // Promisify the callback results
        Promise.resolve(this.method(args)).then(result => {
          if (this.onSuccess instanceof Function) {
            this.onSuccess(result, args);
          }
          resolve({ result, args });
        }).catch(err => {
          if (this.onFailure instanceof Function) {
            this.onFailure(err, args);
          }
          reject({ err, args });
        });
      } else {
        if (this.onSuccess instanceof Function) {
          this.onSuccess(null, args);
        }
        resolve({ result: null, args });
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
