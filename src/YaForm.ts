import YaFormConfig from './YaFormConfig';

interface YaFormbaseCallbackArgs {
  name: string,
  form: Object,
  schema?: Function,
  dispatch: Function,
  state: Function,
}

interface YaFormInterface {
  name: string,
  store: {
    getState?: Function,
    dispatch?: Function,
  }
}

export { YaFormInterface };

class YaForm implements YaFormInterface {
  name: string;
  store: {
    getState?: Function,
    dispatch?: Function,
  };
  private validator: Function;
  private method: Function;
  private onSubmit: Function;
  private onSuccess: Function;
  private onFailure: Function;
  private onValidation: Function;
  private schema: Function;

  constructor(name: string, store?: Object) {
    this.name = name;
    // TODO Use configureStore if neither option exists
    this.store = store || YaFormConfig.store;
  }
  setValidator(validator: Function): YaForm {
    this.validator = validator;
    return this;
  }
  setMethod(method: Function): YaForm {
    this.method = method;
    return this;
  }
  setOnSubmit(onSubmit: Function): YaForm {
    this.onSubmit = onSubmit;
    return this;
  }
  setOnSuccess(onSuccess: Function): YaForm {
    this.onSuccess = onSuccess;
    return this;
  }
  setOnFailure(onFailure: Function): YaForm {
    this.onFailure = onFailure;
    return this;
  }
  setOnValidation(onValidation: Function): YaForm {
    this.onValidation = onValidation;
    return this;
  }
  setSchema(schema: Function): YaForm {
    this.schema = schema;
    return this;
  }
  submit(): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
     // Create an object from the current state containg a mapping between field names and values.
     const form = (() => {
       const formState = this.store.getState().yaForm[name];
       const obj = {};
       if (formState.hasOwnProperty('fields')) {
         const fields = formState.fields;
         for (const key in fields) {
           if (key) {
             obj[key] = fields[key].value;
           }
         }
       }
       return obj;
     })();

     const baseCallbackArgs: YaFormbaseCallbackArgs = {
       name: this.name,
       form: form,
       schema: this.schema,
       dispatch: this.store.dispatch,
       state: this.store.getState,
     };

     // Run onSubmit
     if (this.onSubmit) {
       const err: any = this.onSubmit(baseCallbackArgs);
       if (err) {
         this.onFailure(err, baseCallbackArgs);
         reject(Object.assign({}, err, baseCallbackArgs));
       }
     }

     // Validator the form
     if (this.validator) {
       const err: any = this.validator(baseCallbackArgs);
       if (err) {
         this.onFailure(err, baseCallbackArgs);
         reject(Object.assign({}, err, baseCallbackArgs));
       }
     }

     if (this.method) {
       // Promisify the callback results
       Promise.resolve(this.method(baseCallbackArgs)).then(result => {
         if (this.onSuccess) {
           this.onSuccess(result, baseCallbackArgs);
         }
         resolve(Object.assign({}, result, baseCallbackArgs));
       }, err => {
         if (this.onFailure) {
           this.onFailure(err, baseCallbackArgs);
         }
         reject(Object.assign({}, err, baseCallbackArgs));
       });
     } else {
       if (this.onSuccess) {
         this.onSuccess(baseCallbackArgs);
       }
     }
  });

  return promise;

  }
}

export { YaForm };
