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
  submit({ formName, validator, schema }) {
    const formValidator = validator || YaForm.config.validator;
    if (!formValidator) {
      throw new Error('No validator provided to submit function or set as default.');
    }
    if (!schema) {
      throw new Error('No schema provided to submit function.');
    }
    const form = formToObj(formName);
    const validate = formValidator(form, schema, Redux.store.dispatch, Redux.store.getState);
  },
};

export default YaForm;
