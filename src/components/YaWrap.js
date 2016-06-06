import React from 'react';
import { Provider } from 'react-redux';
import YaFormConfig from '../YaFormConfig';

const yaWrap = (field) => {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      this.getFormName = this.getFormName.bind(this);
    }
    componentWillMount() {
      const { name, value } = this.props.element.props;
      const form = this.getFormName();
            // this.props.createField({ formName, name, value });
    }
    componentWillUnmount() {
      const { name } = this.props.element.props;
      const form = this.getFormName();
            // this.props.removeField({ formName, name });
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
      return (
                <div>
                </div>
            );
    }
  }

  Wrapper.propTypes = {
    element: React.PropTypes.element.isRequired,
  };

  Wrapper.contextTypes = {
    form: React.PropTypes.string,
  };

  return (
    <Provider store={YaFormConfig.store}>
      <Wrapper element={field} />
    </Provider>
  );
};

export default yaWrap;
