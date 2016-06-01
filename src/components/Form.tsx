import * as React from 'react';
import { PropTypes } from 'react';
import { Provider } from 'react-redux';
import YaFormConfig from '../YaFormConfig';

class Form extends React.Component<any, any> {
  public static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  };
  public static childContextTypes = {
    form: PropTypes.string.isRequired,
  };
  public getChildContext() {
    return {
      form: this.props.name,
    };
  }
  public render() {
    return (
      <Provider store={(YaFormConfig.store)}>
        <form name={this.props.name} className={this.props.className ? this.props.className : 'ya-react-form'}>
          {this.props.children}
        </form>
      </Provider>
    );
  }
}

export default Form;
