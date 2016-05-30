interface YaFormConfigInterface {
  store?: Object,
  validator?: Function,
  setStore(store: Object) : void,
};

export { YaFormConfigInterface };

const YaFormConfig : YaFormConfigInterface = {
  setStore(store: Object) {
    YaFormConfig.store = store;
  },
};

export default YaFormConfig;
