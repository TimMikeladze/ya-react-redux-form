import React from 'react';
import { Provider } from 'react-redux';
import YaFormConfig from '../YaFormConfig';
import Form from './Form';

const FormProvider = (props) => (
  <Provider store={YaFormConfig.store}>
    <Form {...props} />
  </Provider>
);

export default FormProvider;
