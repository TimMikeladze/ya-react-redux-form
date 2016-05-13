// TODO Improve validation
const YaForm = {
  config: {
    validator: null,
    generator: null,
    store: null,
  },
  getState: null,
  dispatch: null,
  setStore(store) {
    YaForm.config.store = store;
    YaForm.getState = store.getState;
    YaForm.dispatch = store.dispatch;
  },
  submit({ name, validator, schema, method, onSubmit, onSuccess, onFailure, onValidation }) {
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

      // Run onSubmit callback
      if (onSubmit) {
        onSubmit({ name, form, dispatch: YaForm.dispatch, getState: YaForm.getState });
      }

      // Validate the form. formValidator returns undefined if there are no validation errors.
      let validationResults;
      if (formValidator) {
        validationResults = formValidator(
          { name, form, schema, dispatch: YaForm.dispatch, getState: YaForm.getState }
        );
      }
      // Run onValidation callback
      if (onValidation) {
        onValidation(
          { name, form, validationResults,
            dispatch: YaForm.dispatch, getState: YaForm.getState }
        );
      }

      // If validation passed run provided method
      if (!validationResults) {
        if (method instanceof Function) {
          // Run the method
          const methodPromise = method(
            { name, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
          );
          // Require method to return a Promise
          if (!(methodPromise instanceof Promise)) {
            reject('method must return a Promise');
          }
          // Handle promise
          methodPromise.then(result => {
            // Run onSuccess callback
            if (onSuccess) {
              onSuccess(
                { result, name, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
              );
            }
            resolve({ result, name, form, dispatch: YaForm.dispatch, getState: YaForm.getState });
          }).catch(err => {
            // Run onFailure callback
            if (onFailure) {
              onFailure(
                { err, name, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
              );
            }
            reject({ err, name, form, dispatch: YaForm.dispatch, getState: YaForm.getState });
          });
        } else {
          resolve(
            { name, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
          );
        }
      } else {
        reject(
          { validationResults, name, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
        );
      }
    });
    return promise;
  },
};

export default YaForm;
