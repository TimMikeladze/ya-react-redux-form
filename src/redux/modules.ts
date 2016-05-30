const objectAssignDeep = require('object-assign-deep');

const CREATE_FORM = 'ya-react-form/CREATE_FORM';
const REMOVE_FORM = 'ya-react-form/REMOVE_FORM';
const CREATE_FIELD = 'ya-react-form/CREATE_FIELD';
const REMOVE_FIELD = 'ya-react-form/REMOVE_FIELD';
const CHANGE_FIELD_VALUE = 'ya-react-form/CHANGE_FIELD_VALUE';
const SUBMIT_FORM = 'ya-react-form/SUBMIT_FORM';
const ERROR = 'ya-react-form/ERROR';
const INVALIDATED_FIELD = 'ya-react-form/INVALIDATED_FIELD';

interface IField {
  value?: string;
  error?: string;
}

export { IField };

interface IFields {
    [propName: string]: IField;
}

export { IFields };

interface IForm {
  fields: IFields;
}

export { IForm };

interface IState {
  [propName: string]: IForm;
}

export { IState };

interface IAction {
  type: string;
  payload?: any;
};

export { IAction };

function reducer(state: IState = {}, action: IAction): IState {
  let nextState;
  switch (action.type) {
    case CREATE_FORM:
      nextState = objectAssignDeep({}, state, {
        [action.payload.name]: action.payload.form || {},
      });
      break;
    case REMOVE_FORM:
      nextState = objectAssignDeep({}, state);
      delete nextState[action.payload.name];
      break;
    default:
      return state;
  }

  return nextState;
}

export default reducer;

function createForm(name: string, form?: IForm): IAction {
  return {
    type: CREATE_FORM,
    payload: {
      name,
      form,
    },
  };
}

export { createForm };

function removeForm(name: string): IAction {
  return {
    type: REMOVE_FORM,
    payload: {
      name,
    },
  };
}

export { removeForm };
