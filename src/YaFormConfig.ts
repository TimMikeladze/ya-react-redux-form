interface YaFormConfigInterface {
  store?: Object;
  validator?: Function;
  setStore(store: Object): void;
};

export { YaFormConfigInterface };

const yaFormConfig: YaFormConfigInterface = {
  setStore(store: Object) {
    yaFormConfig.store = store;
  },
};

export default yaFormConfig;
