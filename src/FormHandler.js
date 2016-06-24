class FormHandler {
  constructor(store) {
    this.store = store;
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
        const formState = this.store.getState().yaForm[name];
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
        dispatch: this.store.dispatch,
        state: this.store.getState,
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
        }, err => {
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

export default FormHandler;
