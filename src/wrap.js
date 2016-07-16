import React from 'react';
import Wrapper from './components/Wrapper';

// eslint-disable-next-line react/prefer-stateless-function
const wrap = (Component, options) => class extends React.Component {
  render() {
    return <Wrapper component={<Component {...this.props} />} {...options} />;
  }
};


export default wrap;
