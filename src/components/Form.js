import React from 'react';
import { Provider } from 'react-redux';
import YaForm from '../yaForm';
import Submit from './Submit';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.submitButton = this.submitButton.bind(this);
  }
  getChildContext() {
    return {
      formName: this.props.name,
    };
  }
  submitButton() {
    return (
      <Submit formName={this.props.name} method={this.props.method}
        validator={this.props.validator} generator={this.props.generator}
        onSuccess={this.props.onSuccess} onFailure={this.props.onFailure}
        onValidationError={this.props.onValidationError} onFieldChange={this.props.onFieldChange}
      />
    );
  }
  render() {
    return (
      <form name={this.props.name} className={this.props.className || 'ya-react-form'}>
        {this.props.children}
        { this.props.hasSubmitButton ? this.props.submitButton || this.submitButton() : '' }
    </form>
    );
  }
}

Form.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
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

Form.childContextTypes = {
  formName: React.PropTypes.string,
};

const FormContainer = (props) => (
  <Provider store={YaForm.config.store}>
    <Form {...props} />
  </Provider>
);

export default FormContainer;
