import React from 'react';
import { addField, removeField, changeField } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormHandler from '../FormHandler';

class Wrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    this.getFormName = this.getFormName.bind(this);

    if (!this.props.element.props.name) {
      throw new Error('Must provide a name prop to your component.');
    }
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
  getFormName() {
    if ((this.props.element.props.form === undefined
        || this.props.element.props.form.length === 0)
          && (this.context.form === undefined || this.context.form.length === 0)) {
      throw new Error('A form prop or a form context type must be provided to YaWrap');
    }
    return this.props.element.props.form || this.context.form;
  }
  render() {
    const { onChangeProp, errorProp, onChange, element } = this.props;
    const formName = this.getFormName();

    const wrap = (handler, prop) => (...args) => {
      handler({
        store: this.store,
        formName,
        name: element.props.name,
        args: { ...args },
      });
      return prop;
    };

    const newProps = {
      [onChangeProp]: wrap(onChange, element.props[onChangeProp]),
      [errorProp]: FormHandler.getFieldError(formName, element.props.fieldName,
         this.store.getState()),
    };

    return React.cloneElement(element, newProps);
  }
}

Wrapper.propTypes = {
  store: storeShape,
  element: React.PropTypes.element.isRequired,
  onChangeProp: React.PropTypes.string,
  errorProp: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

Wrapper.defaultProps = {
  onChangeProp: 'onChange',
  errorProp: 'error',
  onChange: ({ store, formName, name, args }) => {
    store.dispatch(
      changeField(formName, name, { value: args[0].target.value })
    );
  },
};

Wrapper.contextTypes = {
  store: storeShape,
  form: React.PropTypes.string,
};

export default Wrapper;
