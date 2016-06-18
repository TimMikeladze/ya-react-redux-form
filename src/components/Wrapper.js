import React from 'react';
import { connect } from 'react-redux';
import { addField, removeField, changeField } from '../redux/modules';
import YaForm from '../yaForm';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.getFormName = this.getFormName.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    const { name, value } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    this.props.addField(form, name, { value });
  }
  componentWillUnmount() {
    const { name } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    // Hacky way to handle race condition of form being removed first resulting in the removal
    // of all the fields under it.
    try {
      this.props.removeField(form, name);
    } catch (e) { // eslint-disable-line no-empty
    }
  }
  onChange(e) {
    const { name, onChange } = this.props.element.props; // eslint-disable-line react/prop-types
    this.props.changeField(this.getFormName(), name, { value: e.target.value });
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
    const state = this.props.state;
    return React.cloneElement(this.props.element, {
      onChange: this.onChange,
      hasError: YaForm.hasFieldError(state, formName, fieldName),
      error: YaForm.getFieldError(state, formName, fieldName),
    });
  }
}

Wrapper.propTypes = {
  element: React.PropTypes.element.isRequired,
  addField: React.PropTypes.func.isRequired,
  removeField: React.PropTypes.func.isRequired,
  changeField: React.PropTypes.func.isRequired,
  state: React.PropTypes.object.isRequired,
};

Wrapper.contextTypes = {
  form: React.PropTypes.string,
};

// TODO Should not be passing state. Issue that form name not accessible in this scope.
const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch) => ({
  addField: (form, name, value) => dispatch(addField(form, name, value)),
  removeField: (form, name) => dispatch(removeField(form, name)),
  changeField: (form, fieldName, field) => dispatch(changeField(form, fieldName, field)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
