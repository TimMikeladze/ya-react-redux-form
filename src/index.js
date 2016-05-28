import reducer, * as FormActions from './redux/modules';
import configureStore from './redux/configureStore';
import Form from './components/Form';
import YaWrap from './components/YaWrap';
import YaForm from './yaForm';

if (!YaForm.config.store) {
  YaForm.setStore(configureStore());
}

export default YaForm ;

export { reducer, FormActions };

export { Form, YaWrap };
