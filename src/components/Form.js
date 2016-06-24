import React from 'react';
import { createForm, removeForm } from '../redux/modules';
import storeShape from '../util/storeShape';

class Form extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    this.submit = this.submit.bind(this);
  }
  getChildContext() {
    return {
      form: this.props.name,
    };
  }
  componentWillMount() {
    this.store.dispatch(createForm(this.props.name));
  }
  componentWillUnmount() {
    this.store.dispatch(removeForm(this.props.name));
  }
  submit(event) {
    event.preventDefault();
    if (this.props.beforeSubmit) {
      this.props.beforeSubmit(event);
    }
    if (this.props.onSubmit) {
      this.props.onSubmit(event);
    }
  }
  render() {
    return (
        <form name={this.props.name} onSubmit={this.submit}
          className={this.props.className ? this.props.className : 'yaForm'}
        >
          {this.props.children}
        </form>
    );
  }
}

Form.propTypes = {
  store: storeShape,
  name: React.PropTypes.string.isRequired,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
  beforeSubmit: React.PropTypes.func,
};

Form.contextTypes = {
  store: storeShape,
};

Form.childContextTypes = {
  form: React.PropTypes.string.isRequired,
};

export default Form;
