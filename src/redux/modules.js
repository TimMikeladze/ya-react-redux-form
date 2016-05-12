import objectAssignDeep from 'object-assign-deep';

const CREATE_FIELD = 'ya-react-form/CREATE_FIELD';
const REMOVE_FIELD = 'ya-react-form/REMOVE_FIELD';
const CHANGE_FIELD_VALUE = 'ya-react-form/CHANGE_FIELD_VALUE';
const SUBMIT_FORM = 'ya-react-form/SUBMIT_FORM';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {
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
    case SUBMIT_FORM:
      return state;
    case REMOVE_FIELD: {
      const nextState = objectAssignDeep({}, state);
      delete nextState[action.formName].fields[action.name];
      return nextState;
    }
    case CREATE_FIELD:
      return objectAssignDeep({}, state, {
        [action.formName]: {
          fields: {
            [action.name]: {
              value: action.value,
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

const submitForm = ({ formName, simpleSchema, options = {} }) => (dispatch, getState) => {
  dispatch({
    type: SUBMIT_FORM,
    formName,
  });
};

export { submitForm };
