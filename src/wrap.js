import React from 'react';
import Wrapper from './components/Wrapper';

const wrap = (field, options) =>
  <Wrapper element={field} {...options } />;

export default wrap;
