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
    const { handlerMap, handlers, element } = this.props;
    const formName = this.getFormName();

    const wrap = (handler, prop) => (...args) => {
      handlers[handler]({
        store: this.store,
        formName,
        name: element.props.name,
        args: { ...args },
      });
      return prop;
    };

    const wrappedProps = {
      [handlerMap.onChange]: wrap('onChange', element.props[handlerMap.onChange]),
    };

    return React.cloneElement(element, wrappedProps);

    /*
    const formName = this.getFormName();
    const fieldName = this.props.element.props.name;
    return React.cloneElement(this.props.element, {
      onChange: this.onChange,
      error: FormHandler.getFieldError(formName, fieldName, this.store.getState()),
    });
  }*/
  }
}

Wrapper.propTypes = {
  store: storeShape,
  element: React.PropTypes.element.isRequired,
  handlerMap: React.PropTypes.shape({
    onChange: React.PropTypes.string,
    error: React.PropTypes.string,
  }),
  handlers: React.PropTypes.shape({
    onChange: React.PropTypes.func,
    error: React.PropTypes.func,
  }),
};

Wrapper.defaultProps = {
  handlerMap: {
    onChange: 'onChange',
    error: 'error',
  },
  handlers: {
    onChange: ({ store, formName, name, args }) => {
      store.dispatch(
        changeField(formName, name, { value: args[0].target.value })
      );
    },
  },
};

Wrapper.contextTypes = {
  store: storeShape,
  form: React.PropTypes.string,
};

export default Wrapper;
