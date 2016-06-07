import React from 'react';
import { Provider } from 'react-redux';
import YaFormConfig from '../YaFormConfig';
import Wrapper from './Wrapper';

const yaWrap = (field) => {
  return (
    <Provider store={YaFormConfig.store}>
      <Wrapper element={field} />
    </Provider>
  );
};

export default yaWrap;
