import React from 'react';
import { connect } from 'react-redux';
import { addField, removeField, changeField } from '../redux/modules';
import storeShape from '../util/storeShape';
import FormRegistry from '../FormRegistry';

class Wrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.store = props.store || context.store;
    this.getFormName = this.getFormName.bind(this);

    if (!this.props.component.props.name) {
      throw new Error('Must provide a name prop to your component.');
    }
  }
  componentWillMount() {
    const { name, value } = this.props.component.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    if (!FormRegistry.instance.has(form)) {
      this.store.dispatch(addField(form, name, { value }));
    }
  }
  componentWillUnmount() {
    if (this.context.yaForm.autoRemove) {
      const { name } = this.props.component.props; // eslint-disable-line react/prop-types
      const form = this.getFormName();
      // Hacky way to handle race condition of form being removed first resulting in the removal
      // of all the fields under it.
      try {
        this.store.dispatch(removeField(form, name));
      } catch (e) { // eslint-disable-line no-empty
      }
    }
  }
  getFormName() {
    if ((this.props.component.props.form === undefined
        || this.props.component.props.form.length === 0)
          && (this.context.yaForm.form === undefined || this.context.yaForm.form.length === 0)) {
      throw new Error('A form prop or a yaForm context must be provided to the wrapped component');
    }
    return this.props.component.props.form || this.context.yaForm.form;
  }
  render() {
    const { value, error, onChangeProp, errorProp, valueProp, onChange, component } = this.props;
    const formName = this.getFormName();
    const { name } = component.props;
    const wrap = (handler, prop) => (...args) => {
      handler({
        store: this.store,
        formName,
        name,
        args: { ...args },
      });
      return prop;
    };

    const newProps = {
      [onChangeProp]: wrap(onChange, component.props[onChangeProp]),
      [valueProp]: value(formName, name),
      [errorProp]: error(formName, name),
    };


    return React.cloneElement(component, newProps);
  }
}

Wrapper.propTypes = {
  store: storeShape,
  component: React.PropTypes.element.isRequired,
  onChangeProp: React.PropTypes.string,
  errorProp: React.PropTypes.string,
  valueProp: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.func,
  error: React.PropTypes.error,
};

Wrapper.defaultProps = {
  onChangeProp: 'onChange',
  errorProp: 'error',
  valueProp: 'value',
  onChange: ({ store, formName, name, args }) => {
    store.dispatch(
      changeField(formName, name, { value: args[0].target.value })
    );
  },
};

Wrapper.contextTypes = {
  store: storeShape,
  yaForm: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  value: (formName, name) => (
    state.yaForm[formName].fields.hasOwnProperty(name)
      ? state.yaForm[formName].fields[name].value
      : ''),
  error: (formName, name) => (
      state.yaForm[formName].fields.hasOwnProperty(name)
        ? state.yaForm[formName].fields[name].error
        : ''),
});

export default connect(mapStateToProps, null)(Wrapper);
