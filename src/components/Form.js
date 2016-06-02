import React from 'react';
import { Provider } from 'react-redux';
import YaFormConfig from '../YaFormConfig';

class Form extends React.Component<any, any> {
  getChildContext() {
    return {
      form: this.props.name,
    };
  }
  render() {
    return (
      <Provider store={(YaFormConfig.store)}>
        <form name={this.props.name}
          className={this.props.className ? this.props.className : 'ya-react-form'}
        >
          {this.props.children}
        </form>
      </Provider>
    );
  }
}

Form.propTypes = {
  name: React.PropTypes.string.isRequired,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
};

Form.childContextTypes = {
  form: React.PropTypes.string.isRequired,
};

export default Form;
