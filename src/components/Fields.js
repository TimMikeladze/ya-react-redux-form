import React from 'react';

const Fields = ({
  children,
  formName,
  method,
  schema,
  validator,
  generator,
  onSuccess,
  onFailure,
  onValidationError,
  onFieldChange,
}) => {
  const newChildren = React.Children.map(children, child => (
    React.cloneElement(child, {
      formName,
      method,
      schema,
      validator,
      generator,
      onSuccess,
      onFailure,
      onValidationError,
      onFieldChange,
    })
  ));

  return (
    <div className="ya-react-form-fields">
      {newChildren}
    </div>
  );
};

Fields.propTypes = {
  children: React.PropTypes.node,
  formName: React.PropTypes.string.isRequired,
  method: React.PropTypes.func,
  schema: React.PropTypes.any,
  validator: React.PropTypes.func,
  generator: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func,
  onValidationError: React.PropTypes.func,
  onFieldChange: React.PropTypes.func,
};

export default Fields;
