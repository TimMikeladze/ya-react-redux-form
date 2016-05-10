import React from 'react';

const YaWrapSubmit = ({
  children,
  name,
  method,
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
        React.cloneElement(child, { formName: name })
      )) }
      {hasSubmitButton
        ? submitButton
        || <SubmitButton formName={name} method={method} validator={validator} generator={generator}
          hasSubmitButton={hasSubmitButton} submitButton={submitButton}
          onSuccess={onSuccess} onFailure={onFailure} onValidationError={onValidationError}
          onFieldChange={onFieldChange}
        />
         : ''
       }
    </form>
  );
};

YaWrapSubmit.propTypes = {
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
  validator: React.PropTypes.func,
  generator: React.PropTypes.func,
  hasSubmitButton: React.PropTypes.bool,
  submitButton: React.PropTypes.element,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func,
  onValidationError: React.PropTypes.func,
  onFieldChange: React.PropTypes.func,
};
