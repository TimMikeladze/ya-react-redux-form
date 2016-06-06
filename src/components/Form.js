import React from 'react';

class Form extends React.Component {
  getChildContext() {
    return {
      form: this.props.name,
    };
  }
  render() {
    return (
        <form name={this.props.name}
          className={this.props.className ? this.props.className : 'ya-react-form'}
        >
          {this.props.children}
        </form>
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
