const objectAssignDeep = require('object-assign-deep');

const CREATE_FORM = 'ya-react-form/CREATE_FORM';
const REMOVE_FORM = 'ya-react-form/REMOVE_FORM';
const ADD_FIELD = 'ya-react-form/ADD_FIELD';
const REMOVE_FIELD = 'ya-react-form/REMOVE_FIELD';
const CHANGE_FIELD = 'ya-react-form/CHANGE_FIELD';
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

const reducer = (state: IState = {}, action: IAction): IState => {
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
        case ADD_FIELD:
            nextState = objectAssignDeep({}, state, {
                [action.payload.form]: {
                    fields: {
                        [action.payload.fieldName]: action.payload.field || { value: '' },
                    },
                },
            });
            break;
        case REMOVE_FIELD:
            nextState = objectAssignDeep({}, state);
            if (state.hasOwnProperty(action.payload.form)
              && state[action.payload.form].hasOwnProperty('fields')
              && state[action.payload.form].fields[action.payload.fieldName]
            ) {
              delete nextState[action.payload.form].fields[action.payload.fieldName];
            }
            break;
        case CHANGE_FIELD:
            nextState = objectAssignDeep({}, state, {
                [action.payload.form]: {
                    fields: {
                        [action.payload.fieldName]: action.payload.field,
                    },
                },
            });
            break;
        default:
            return state;
    }

    return nextState;
};

export default reducer;

const createForm = (name: string, form?: IForm): IAction => (
    {
        type: CREATE_FORM,
        payload: {
            name,
            form,
        },
    }
);

export { createForm };

const removeForm = (name: string): IAction => (
    {
        type: REMOVE_FORM,
        payload: {
            name,
        },
    }
);

export { removeForm };

const addField = (form: string, fieldName: string, field?: IField): IAction => (
    {
        type: ADD_FIELD,
        payload: {
            form,
            fieldName,
            field,
        },
    }
);

export { addField };

const removeField = (form: string, fieldName: string): Function => (
    (dispatch, getState) => {
        if (!getState().yaForm.hasOwnProperty(form)) {
            throw new Error(`form ${form} does not exist in the yaForm state`);
        }
        if (!getState().yaForm[form].hasOwnProperty('fields')
            || !getState().yaForm[form].fields.hasOwnProperty(fieldName)) {
            throw new Error(`field ${fieldName} does not exist in ${form}`);
        }
        dispatch({
            type: REMOVE_FIELD,
            payload: {
                form,
                fieldName,
            },
        });
    }
);

export { removeField };

const changeField = (form: string, fieldName: string, field: IField): IAction => (
    {
        type: CHANGE_FIELD,
        payload: {
            form,
            fieldName,
            field,
        },
    }
);

export { changeField };
