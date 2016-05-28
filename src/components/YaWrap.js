import React from 'react';
import { connect } from 'react-redux';
import * as FormActions from '../redux/modules';
import YaForm from '../yaForm';

const YaWrap = InputComponent => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      this.wrapHandleChange = this.wrapHandleChange.bind(this);
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
    wrapHandleChange(value) {
      const { name } = this.props;
      const formName = this.getFormName();
      this.props.fieldChanged({ formName, name, value });
      if (this.props[this.props.callbackPropNames.handleChange]) {
        this.props[this.props.callbackPropNames.handleChange](value);
      }
    }
    render() {
      const formName = this.getFormName();
      const name = this.props.name;
      const newProps = {
        ...this.props,
        [this.props.callbackPropNames.handleChange]: this.wrapHandleChange,
        field: this.props.field({ formName, name }),
      };
      return <InputComponent {...newProps} />;
    }
  }

  Wrapper.propTypes = {
    name: React.PropTypes.string.isRequired,
    formName: React.PropTypes.string,
    value: React.PropTypes.string,
    handleChange: React.PropTypes.func,
    fieldChanged: React.PropTypes.func.isRequired,
    field: React.PropTypes.object,
    createField: React.PropTypes.func.isRequired,
    removeField: React.PropTypes.func.isRequired,
    callbackPropNames: React.PropTypes.shape({
      handleChange: React.PropTypes.string,
    }),
  };

  Wrapper.defaultProps = {
    callbackPropNames: {
      handleChange: 'handleChange',
    },
  };

  Wrapper.contextTypes = {
    formName: React.PropTypes.string,
  };

  const mapStateToProps = () => ({
    field: ({ formName, name }) => YaForm.getFormField(formName, name),
  });

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

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
};

export default YaWrap;
