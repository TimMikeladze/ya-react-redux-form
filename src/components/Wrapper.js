import React from 'react';
import { addField, removeField, changeField } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormHandler from '../FormHandler';

class Wrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    this.getFormName = this.getFormName.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    const { name, value } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    this.store.dispatch(addField(form, name, { value }));
  }
  componentWillUnmount() {
    const { name } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    // Hacky way to handle race condition of form being removed first resulting in the removal
    // of all the fields under it.
    try {
      this.store.dispatch(removeField(form, name));
    } catch (e) { // eslint-disable-line no-empty
    }
  }
  onChange(e) {
    const { name, onChange } = this.props.element.props; // eslint-disable-line react/prop-types
    this.store.dispatch(changeField(this.getFormName(), name, { value: e.target.value }));
    if (onChange) {
      onChange(e);
    }
  }
  getFormName() {
    if ((this.props.element.props.form === undefined
        || this.props.element.props.form.length === 0)
          && (this.context.form === undefined || this.context.form.length === 0)) {
      throw new Error('A form prop or a form context type must be provided to YaWrap');
    }
    return this.props.element.props.form || this.context.form;
  }
  render() {
    const formName = this.getFormName();
    const fieldName = this.props.element.props.name;
    return React.cloneElement(this.props.element, {
      onChange: this.onChange,
      error: FormHandler.getFieldError(formName, fieldName, this.store.getState()),
    });
  }
}

Wrapper.propTypes = {
  store: storeShape,
  element: React.PropTypes.element.isRequired,
};

Wrapper.contextTypes = {
  store: storeShape,
  form: React.PropTypes.string,
};

export default Wrapper;
