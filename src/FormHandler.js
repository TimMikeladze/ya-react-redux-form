import 'whatwg-fetch';

class FormHandler {
  constructor(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
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
    const promise = new Promise((resolve, reject) => {
     // Create an object from the current state containg a mapping between field names and values.
      const form = (() => {
        const formState = this.getState().yaForm[name];
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
        getState: this.getState,
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

export default FormHandler;
