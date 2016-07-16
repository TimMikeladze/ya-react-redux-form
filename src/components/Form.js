import React from 'react';
import filterProps from 'react-valid-props';
import { createForm, removeForm } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormHandler from '../FormHandler';
import FormRegistry from '../FormRegistry';

class Form extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    const { dispatch, getState } = this.store;
    const { name, onSubmit, onSuccess, onFailure, method } = this.props;
    this.handler = this.props.handler || new FormHandler({ dispatch, getState, name });
    if (onSubmit) {
      this.handler.addOnSubmit(onSubmit);
    }
    if (onSuccess) {
      this.handler.addOnSuccess(this.props.method);
    }
    if (onFailure) {
      this.handler.addOnFailure(this.props.onSuccess);
    }
    if (method) {
      this.handler.setMethod(method);
    }
    this.submit = this.submit.bind(this);
  }
  getChildContext() {
    return {
      yaForm: {
        form: this.props.name,
        autoRemove: this.props.autoRemove,
      },
    };
  }
  componentWillMount() {
    if (!FormRegistry.instance.has(this.props.name)) {
      FormRegistry.instance.add(this.props.name, this.handler);
      this.store.dispatch(createForm(this.props.name));
    }
  }
  componentWillUnmount() {
    if (this.props.autoRemove && FormRegistry.instance.has(this.props.name)) {
      FormRegistry.instance.remove(this.props.name);
      this.store.dispatch(removeForm(this.props.name));
    }
  }
  submit(event) {
    event.preventDefault();
    this.handler.submit();
  }
  render() {
    return (
        <form {...filterProps(this.props)} onSubmit={this.onSubmit}>
          {this.props.children}
        </form>
    );
  }
}

Form.propTypes = {
  store: storeShape,
  name: React.PropTypes.string.isRequired,
  children: React.PropTypes.node,
  autoRemove: React.PropTypes.bool,
  handler: React.PropTypes.object,
  method: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  onSuccess: React.PropTypes.func,
  onFailure: React.PropTypes.func,
};

Form.defaultProps = {
  autoRemove: true,
};

Form.contextTypes = {
  store: storeShape,
};

Form.childContextTypes = {
  yaForm: React.PropTypes.shape({
    form: React.PropTypes.string.isRequired,
    autoRemove: React.PropTypes.bool.isRequired,
  }).isRequired,
};

export default Form;
