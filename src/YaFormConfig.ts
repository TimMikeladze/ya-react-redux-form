import { Store } from 'redux';

interface IYaFormConfigInterface {
  store?: Store;
  validator?: Function;
  setStore(store: Store): void;
};

export { IYaFormConfigInterface };

const yaFormConfig: IYaFormConfigInterface = {
  setStore(store: Store) {
    yaFormConfig.store = store;
  },
};

export default yaFormConfig;
