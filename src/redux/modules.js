import objectAssignDeep from 'object-assign-deep';

const CREATE_FIELD = 'ya-react-form/CREATE_FIELD';
const REMOVE_FIELD = 'ya-react-form/REMOVE_FIELD';
const CHANGE_FIELD_VALUE = 'ya-react-form/CHANGE_FIELD_VALUE';
const SUBMIT_FORM = 'ya-react-form/SUBMIT_FORM';
const ERROR = 'ya-react-form/ERROR';
const INVALIDATED_FIELD = 'ya-react-form/INVALIDATED_FIELD';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SUBMIT_FORM: {
      const nextState = objectAssignDeep({}, state);
      // Clear form level error
      if (nextState[action.formName].hasOwnProperty('error')) {
        delete nextState[action.formName].error;
      }
      // Clear field level errors
      nextState[action.formName] = nextState[action.formName].fields.forEach(field => (
        {
          value: field.value,
          hasError: false,
        }
      ));
      return nextState;
    }
    case CHANGE_FIELD_VALUE:
      return objectAssignDeep({}, state, {
        [action.formName]: {
          fields: {
            [action.name]: {
              value: action.value,
            },
          },
        },
      });
    case REMOVE_FIELD: {
      const nextState = objectAssignDeep({}, state);
      delete nextState[action.formName].fields[action.name];
      if (Object.keys(nextState[action.formName].fields).length === 0) {
        delete nextState[action.formName];
      }
      return nextState;
    }
    case CREATE_FIELD:
      return objectAssignDeep({}, state, {
        [action.formName]: {
          fields: {
            [action.name]: {
              value: action.value,
              hasError: false,
            },
          },
        },
      });
    case ERROR:
      return objectAssignDeep({}, state, {
        [action.formName]: {
          error: action.reason,
        },
      });
    case INVALIDATED_FIELD:
      return objectAssignDeep({}, state, {
        [action.formName]: {
          fields: {
            [action.name]: {
              error: action.reason,
              hasError: true,
            },
          },
        },
      });
    default:
      return state;
  }
};

export default reducer;

const createField = ({ formName, name, value = '' }) => (
  {
    type: CREATE_FIELD,
    formName,
    name,
    value,
  }
);

export { createField };

const removeField = ({ formName, name }) => (
  {
    type: REMOVE_FIELD,
    formName,
    name,
  }
);

export { removeField };

const changeFieldValue = ({ formName, name, value }) => (
  {
    type: CHANGE_FIELD_VALUE,
    formName,
    name,
    value,
  }
);
export { changeFieldValue };

const submitForm = ({ formName }) => (dispatch) => {
  dispatch({
    type: SUBMIT_FORM,
    formName,
  });
};

export { submitForm };

const error = ({ formName, reason }) => (
  {
    type: ERROR,
    formName,
    reason,
  }
);

export { error };

const invalidateField = ({ formName, name, reason }) => (
  {
    type: INVALIDATED_FIELD,
    formName,
    name,
    reason,
  }
);

export { invalidateField };
