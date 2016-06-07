import React from 'react';
import { connect } from 'react-redux';
import { addField, removeField, changeField } from '../redux/modules';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.getFormName = this.getFormName.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    const { name, value } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    this.props.addField(form, name, value);
  }
  componentWillUnmount() {
    const { name } = this.props.element.props; // eslint-disable-line react/prop-types
    const form = this.getFormName();
    this.props.removeField(form, name);
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
    return React.cloneElement(this.props.element, { onChange: this.onChange });
  }
}

Wrapper.propTypes = {
  element: React.PropTypes.element.isRequired,
  addField: React.PropTypes.func.isRequired,
  removeField: React.PropTypes.func.isRequired,
  changeField: React.PropTypes.func.isRequired,
};

Wrapper.contextTypes = {
  form: React.PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
  addField: (form, name, value) => dispatch(addField(form, name, value)),
  removeField: (form, name) => dispatch(removeField(form, name)),
  changeField: (form, fieldName, field) => dispatch(changeField(form, fieldName, field)),
});

export default connect(null, mapDispatchToProps)(Wrapper);
