import React from 'react';
import { createForm, removeForm } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormHandler from '../FormHandler';
import FormRegistry from '../FormRegistry';

class Form extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    const { dispatch, getState } = this.store;
    const { name } = this.props;
    this.submit = this.submit.bind(this);
    this.handler = this.props.handler || new FormHandler({ dispatch, getState, name });

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
    FormRegistry.add(this.props.name, this.handler);
    this.store.dispatch(createForm(this.props.name));
  }
  componentWillUnmount() {
    FormRegistry.remove(this.props.name);
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
