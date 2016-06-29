const FormRegistry = {
  handlers: {},
  add(name, handler) {
    FormRegistry.handlers[name] = handler;
  },
  remove(name) {
    delete FormRegistry.handlers[name];
  },
  get(name) {
    if (!FormRegistry.handlers.hasOwnProperty(name)) {
      throw new Error(`${name} handler does not exist in the form registery`);
    }
    return FormRegistry.handlers[name];
  },
};

export default FormRegistry;
