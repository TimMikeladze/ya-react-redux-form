// TODO Improve validation
const YaForm = {
  config: {

  },
  setStore(store) {
    YaForm.config.store = store;
    YaForm.getState = store.getState;
    YaForm.dispatch = store.dispatch;
  },
  getForm(form) {
    let returnValue;
    if (YaForm.getState().yaForm.hasOwnProperty(form)) {
      returnValue = YaForm.getState().yaForm[form];
    }
    return returnValue;
  },
  getFormField(form, field) {
    let returnValue;
    if (YaForm.getState().yaForm.hasOwnProperty(form)
      && YaForm.getState().yaForm[form].fields.hasOwnProperty(field)) {
      returnValue = YaForm.getState().yaForm[form].fields[field];
    }
    return returnValue;
  },
  getFormError(form) {
    let returnValue;
    if (YaForm.getState().yaForm.hasOwnProperty(form)
      && YaForm.getState().yaForm[form].hasOwnProperty('error')) {
      returnValue = YaForm.getState().yaForm[form].error;
    }
    return returnValue;
  },
  submit({
    name, validator, schema, method, handleSubmit, handleSuccess, handleFailure, handleValidation,
  }) {
    const promise = new Promise((resolve, reject) => {
      // Use the configured validator if no validator provided
      const formValidator = validator || YaForm.config.validator;

      // Create an object from the current state containg a mapping between field names and values.
      const form = (() => {
        const formState = YaForm.getState().yaForm[name];
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


      // These parameters are always passed to the callback
      const baseCallbackArgs = {
        name, form, schema, method, dispatch: YaForm.dispatch, getState: YaForm.getState,
      };

      // Run onSubmit callback
      if (handleSubmit) {
        const err = handleSubmit(baseCallbackArgs);
        if (err) {
          handleFailure({ err, ...baseCallbackArgs });
          reject({ err, ...baseCallbackArgs });
        }
      }

      // Validate the form.
      if (formValidator) {
        const err = formValidator(baseCallbackArgs);
        if (err) {
          handleValidation({ err, ...baseCallbackArgs });
          reject({ err, ...baseCallbackArgs });
        }
      }

      // Run method callback
      if (method instanceof Function) {
        // Promisify the callback results
        Promise.resolve(method(baseCallbackArgs)).then(result => {
          handleSuccess({ result, ...baseCallbackArgs });
          resolve({ result, ...baseCallbackArgs });
        }).catch(err => {
          handleFailure({ err, ...baseCallbackArgs });
          reject({ err, ...baseCallbackArgs });
        });
      } else {
        handleSuccess(...baseCallbackArgs);
        resolve(baseCallbackArgs);
      }
    });

    return promise;
  },
};

export default YaForm;
