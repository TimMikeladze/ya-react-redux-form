import React from 'react';
import { Provider } from 'react-redux';
import YaForm from '../yaForm';

class Form extends React.Component {
  getChildContext() {
    return {
      formName: this.props.name,
    };
  }
  render() {
    return (
      <form name={this.props.name} className={this.props.className || 'ya-react-form'}>
        {this.props.children}
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
