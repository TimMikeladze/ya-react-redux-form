import React from 'react';
import { connect } from 'react-redux';
import { createForm, removeForm } from '../redux/modules';

class Form extends React.Component {
  getChildContext() {
    return {
      form: this.props.name,
    };
  }
  componentWillMount() {
    this.props.createForm(this.props.name);
  }
  componentWillUnmount() {
    this.props.removeForm(this.props.name);
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
  createForm: React.PropTypes.func.isRequired,
  removeForm: React.PropTypes.func.isRequired,
};

Form.childContextTypes = {
  form: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  createForm: (name) => dispatch(createForm(name)),
  removeForm: (name) => dispatch(removeForm(name)),
});

export default connect(null, mapDispatchToProps)(Form);
