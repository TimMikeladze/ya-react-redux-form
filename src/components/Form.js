import React from 'react';
import { Provider } from 'react-redux';
import YaForm from '../yaForm';
import Fields from './Fields';
import Submit from './Submit';

const Form = ({
  children,
  name,
  method,
  schema,
  validator,
  generator,
  hasSubmitButton,
  submitButton,
  onSuccess,
  onFailure,
  onValidationError,
  onFieldChange,
  }) => {
  return (
    <form name={name}>
      { React.Children.map(children, (child) => (
        child.type === Fields ? React.cloneElement(child, {
          formName: name,
          method,
          schema,
          validator,
          generator,
          hasSubmitButton,
          submitButton,
          onSuccess,
          onFailure,
          onValidationError,
          onFieldChange,
        }) : child
      )) }
      {hasSubmitButton
        ? submitButton
        || <Submit formName={name} method={method} validator={validator} generator={generator}
          onSuccess={onSuccess} onFailure={onFailure} onValidationError={onValidationError}
          onFieldChange={onFieldChange}
        />
         : ''
       }
    </form>
  );
};

Form.propTypes = {
  /*
  simpleSchema(props, propName, componentName) { // eslint-disable-line consistent-return
    if (props.hasOwnProperty(propName) && !(props[propName] instanceof SimpleSchema)) {
      return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);
    }
  },
  */
  children: React.PropTypes.node,
  name: React.PropTypes.string.isRequired,
  method: React.PropTypes.func,
  schema: React.PropTypes.any,
  validator: React.PropTypes.func,
  generator: React.PropTypes.func,
  hasSubmitButton: React.PropTypes.bool,
  submitButton: React.PropTypes.element,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func,
  onValidationError: React.PropTypes.func,
  onFieldChange: React.PropTypes.func,
};

Form.defaultProps = {
  hasSubmitButton: true,
};

const FormContainer = (props) => (
  <Provider store={YaForm.config.store}>
    <Form {...props} />
  </Provider>
);

export default FormContainer;
