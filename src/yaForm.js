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
  submit({ formName, validator, schema, method, onSubmit, onSuccess, onFailure, onValidation }) {
    const promise = new Promise((resolve, reject) => {
      // Use the configured validator if no validator provided
      const formValidator = validator || YaForm.config.validator;

      // Validate required arguments
      if (!formValidator) {
        reject('A `validator` key must be provided or set as default.');
      }
      if (!schema) {
        reject('`schema` key must be provided.');
      }

      // Create an object from the current state containg a mapping between field names and values.
      const form = (() => {
        const formState = YaForm.getState().yaForm[formName];
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
        onSubmit({ formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState });
      }

      // Validate the form. formValidator returns undefined if there are no validation errors.
      const validationResults = formValidator(
        { formName, form, schema, dispatch: YaForm.dispatch, getState: YaForm.getState }
      );
      // Run onValidation callback
      if (onValidation) {
        onValidation(
          { formName, form, validationResults,
            dispatch: YaForm.dispatch, getState: YaForm.getState }
        );
      }

      // If validation passed run provided method
      if (!validationResults) {
        if (method instanceof Function) {
          // Run the method
          const methodPromise = method(
            { formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
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
                { result, formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
              );
            }
            resolve(result);
          }).catch(err => {
            // Run onFailure callback
            if (onFailure) {
              onFailure(
                { err, formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
              );
            }
            reject(err);
          });
        } else {
          resolve();
        }
      } else {
        reject(validationResults);
      }
    });
    return promise;
  },
};

export default YaForm;
