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
    // Use the configured validator if no validator provided
    const formValidator = validator || YaForm.config.validator;

    // Validate required arguments
    if (!formValidator) {
      throw new Error('A `validator` key must be provided or set as default.');
    }
    if (!schema) {
      throw new Error('`schema` key must be provided.');
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
        { formName, form, validationResults, dispatch: YaForm.dispatch, getState: YaForm.getState }
      );
    }

    // If validation passed run provided method
    if (!validationResults) {
      if (method instanceof Function) {
        // Run the method
        const promise = method(
          { formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
        );
        // Require method to return a Promise
        if (!(promise instanceof Promise)) {
          throw new Error('method must return a Promise');
        }
        // Handle promise
        promise.then((result) => {
          // Run onSuccess callback
          if (onSuccess) {
            onSuccess(
              { result, formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
            );
          }
        }).catch((err) => {
          // Run onFailure callback
          if (onFailure) {
            onFailure(
              { err, formName, form, dispatch: YaForm.dispatch, getState: YaForm.getState }
            );
          }
        });
      }
    }
  },
};

export default YaForm;
