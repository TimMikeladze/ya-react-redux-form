import Redux from './redux/redux';

const formToObj = (formName) => {
  const formState = Redux.store.getState()[formName];
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


// TODO Improve validation
const YaForm = {
  config: {
    validator: null,
    generator: null,
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
        throw new Error('A promise must be provided');
      }

      const form = formToObj(formName);
      if (onSubmit) onSubmit(formName, form);

      const validation = formValidator(form, schema, Redux.store.dispatch, Redux.store.getState);
      if (onValidation) onValidation(formName, form, validation);

      if (!validation) {
        // TODO How to handle a promise? Accept only promises or regular methods too? Throw exception?
      }
    }
  },
  setStore(store) {
    Redux.store = store;
  },
};

export default YaForm;
