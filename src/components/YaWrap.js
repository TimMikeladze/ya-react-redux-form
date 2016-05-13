import React from 'react';
import { connect } from 'react-redux';
import * as FormActions from '../redux/modules';

const YaWrap = InputComponent => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      this.wrapOnChange = this.wrapOnChange.bind(this);
      this.getFormName = this.getFormName.bind(this);
    }
    componentWillMount() {
      const { name, value } = this.props;
      const formName = this.getFormName();
      this.props.createField({ formName, name, value });
    }
    componentWillUnmount() {
      const { name } = this.props;
      const formName = this.getFormName();
      this.props.removeField({ formName, name });
    }
    getFormName() {
      if (!(this.props.formName instanceof String)
       && (this.context === undefined
           || (this.context && !this.context.hasOwnProperty('formName'))
         )) {
        throw new Error('A formName prop or a formName context type must be provided to YaWrap');
      }
      return this.context.formName || this.props.formName;
    }
    wrapOnChange(value) {
      const { name } = this.props;
      const formName = this.getFormName();
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
    removeField: React.PropTypes.func.isRequired,
    callbackPropNames: React.PropTypes.shape({
      onChange: React.PropTypes.string,
    }),
  };

  Wrapper.defaultProps = {
    callbackPropNames: {
      onChange: 'onChange',
    },
  };

  Wrapper.contextTypes = {
    formName: React.PropTypes.string,
  };

  const mapDispatchToProps = (dispatch) => ({
    fieldChanged: ({ formName, name, value }) => dispatch(
      FormActions.changeFieldValue({ formName, name, value })),
    createField: ({ formName, name, value }) => dispatch(
      FormActions.createField({ formName, name, value })
    ),
    removeField: ({ formName, name }) => dispatch(
      FormActions.removeField({ formName, name })
    ),
  });

  return connect(null, mapDispatchToProps)(Wrapper);
};

export default YaWrap;
