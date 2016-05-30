const objectAssignDeep = require('object-assign-deep');

const CREATE_FORM = 'ya-react-form/CREATE_FORM';
const CREATE_FIELD = 'ya-react-form/CREATE_FIELD';
const REMOVE_FIELD = 'ya-react-form/REMOVE_FIELD';
const CHANGE_FIELD_VALUE = 'ya-react-form/CHANGE_FIELD_VALUE';
const SUBMIT_FORM = 'ya-react-form/SUBMIT_FORM';
const ERROR = 'ya-react-form/ERROR';
const INVALIDATED_FIELD = 'ya-react-form/INVALIDATED_FIELD';

interface IField {
  value?: string,
  error?: string,
}

export { IField };

interface IFields {
    [propName: string]: IField,
}

export { IFields };

interface IForm {
  fields: IFields,
}

export { IForm };

interface IState {
  [propName: string]: IForm,
}

export { IState };

interface IAction {
  type: string,
  payload: any,
};

export { IAction };

function reducer(state: IState = {}, action: IAction): IState {
  switch(action.type) {
    case CREATE_FORM:
      const nextState = objectAssignDeep({}, state, {
        [action.payload.name]: action.payload.form || {}
      });
      return nextState;
    default:
      return state;
  }
}

export default reducer;

function createForm(name: string, form?: IForm): IAction {
  return {
    type: CREATE_FORM,
    payload: {
      name,
      form
    },
  };
}

export { createForm };
