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
  submit({ formName, validator, schema, promise, onSubmit, onSuccess, onFailure, onValidation }) {
    if (onSubmit !== false) {
      const formValidator = validator || YaForm.config.validator;

      if (!formValidator) {
        throw new Error('A validator must be provided or set as default.');
      }
      if (!schema) {
        throw new Error('A schema must be provided.');
      }
      if (!(promise instanceof Promise)) {
        // throw new Error('A promise must be provided');
      }

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

      if (onSubmit) onSubmit(formName, form);

      const validation = formValidator(form, schema, YaForm.dispatch, YaForm.getState);
      if (onValidation) onValidation(formName, form, validation);

      if (!validation) {
        // TODO How to handle a promise? Accept only promises or regular methods too? Throw exception?
      }
    }
  },
};

export default YaForm;
