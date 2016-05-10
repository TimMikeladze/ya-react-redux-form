import React from 'react';
import { connect } from 'react-redux';
import * as FormActions from '../redux/modules';

const YaWrap = InputComponent => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      this.wrapOnChange = this.wrapOnChange.bind(this);
      const { formName, name, value } = props;
      props.createField({ formName, name, value });
    }
    wrapOnChange(value) {
      const { formName, name } = this.props;
      this.props.fieldChanged({ formName, name, value });
      if (this.props[this.props.callbackPropNames.onChange]) {
        this.props[this.props.callbackPropNames.onChange](value);
      }
    }
    render() {
      const newProps = {
        ...this.props,
        [this.props.callbackPropNames.onChange]: this.wrapOnChange,
      };
      return <InputComponent {...newProps} />;
    }
  }

  Wrapper.propTypes = {
    name: React.PropTypes.string.isRequired,
    formName: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    fieldChanged: React.PropTypes.func.isRequired,
    createField: React.PropTypes.func.isRequired,
    callbackPropNames: React.PropTypes.shape({
      onChange: React.PropTypes.string,
    }),
  };

  Wrapper.defaultProps = {
    callbackPropNames: {
      onChange: 'onChange',
    },
  };

  const mapDispatchToProps = (dispatch) => ({
    fieldChanged: ({ formName, name, value }) => dispatch(
      FormActions.changeFieldValue({ formName, name, value })),
    createField: ({ formName, name, value }) => dispatch(
      FormActions.createField({ formName, name, value })
    ),
  });

  return connect(null, mapDispatchToProps)(Wrapper);
};

export default YaWrap;
