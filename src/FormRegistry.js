const FORM_REGISTRY_KEY = Symbol.for('yaFormRegistry');

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasSymbol = globalSymbols.indexOf(FORM_REGISTRY_KEY) > -1;

if (!hasSymbol) {
  global[FORM_REGISTRY_KEY] = {
    handlers: {},
    add(name, handler) {
      this.handlers[name] = handler;
    },
    remove(name) {
      delete this.handlers[name];
    },
    get(name) {
      if (!this.handlers.hasOwnProperty(name)) {
        throw new Error(`${name} handler does not exist in the form registry`);
      }
      return this.handlers[name];
    },
  };
}

const formRegistry = {};

Object.defineProperty(formRegistry, 'instance', {
  get: () => global[FORM_REGISTRY_KEY],
});

Object.freeze(formRegistry);

export default formRegistry;
