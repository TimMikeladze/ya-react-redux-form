import * as React from 'react';
import { PropTypes } from 'react';

class Form extends React.Component<any, any> {
  public static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  };
  public static childContextTypes = {
    name: PropTypes.string.isRequired,
  };
  public getChildContext() {
    return {
      name: this.props.name,
    };
  }
  public render() {
    return (
      <form name={this.props.name} className={this.props.className ? this.props.className : 'ya-react-form'}>
        {this.props.children}
      </form>
    );
  }
}

export default Form;
