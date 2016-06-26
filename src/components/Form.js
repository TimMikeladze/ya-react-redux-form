import React from 'react';
import { createForm, removeForm } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormHandler from '../FormHandler';

class Form extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    this.submit = this.submit.bind(this);
    this.handler = this.props.handler || new FormHandler(this.store.dispatch, this.store.getState);

    if (this.props.onSubmit) {
      this.handler.setOnSubmit(this.props.onSubmit);
    }
    if (this.props.method) {
      this.handler.setMethod(this.props.method);
    }
    if (this.props.onSuccess) {
      this.handler.setOnSuccess(this.props.onSuccess);
    }
    if (this.props.onFailure) {
      this.handler.setOnFailure(this.props.onFailure);
    }
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
    this.handler.submit(this.props.name);
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
  handler: React.PropTypes.object,
  method: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func,
};

Form.contextTypes = {
  store: storeShape,
};

Form.childContextTypes = {
  form: React.PropTypes.string.isRequired,
};

export default Form;
