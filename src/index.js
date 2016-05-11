import reducer, * as FormActions from './redux/modules';
import configureStore from './redux/configureStore';
import Redux from './redux/redux';
import Form from './components/Form';
import Submit from './components/Submit';
import YaWrap from './components/YaWrap';
import YaForm from './yaForm';

if (!Redux.store) {
  Redux.store = configureStore();
}

export { YaForm };

export { Redux, reducer, FormActions };

export { Form, Submit, YaWrap };
