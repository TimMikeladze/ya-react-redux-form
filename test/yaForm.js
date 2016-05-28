/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';

import YaForm from '../src/yaForm';
import configureStore from '../src/redux/configureStore';

chai.use(spies);
chai.should();
chai.use(chaiAsPromised);

const baseForm = {
  fields: {
    foo: {
      value: 'foo',
    },
    bar: {
      value: 'bar',
      error: 'invalid field',
      hasError: true,
    },
  },
  error: 'invalid',
};

const store = configureStore({
  yaForm: { form: baseForm },
});

describe('YaForm', () => {
  it('can be provided a store', () => {
    YaForm.setStore(store);
    expect(YaForm.config.store).to.be.ok;
  });
  describe('submit', () => {
    it('expects a name', () => {
      expect(() => YaForm.submit({})).to.throw('Expects a name.');
    });
    it('name must exist in the store', () => {
      expect(() => YaForm.submit({ name: 'missing' }))
      .to.throw('missing does not exist in the store.');
    });

    describe('minimal', () => {
      const handleSubmit = chai.spy();
      const handleSuccess = chai.spy();
      const handleFailure = chai.spy();
      const validator = chai.spy();
      const handleValidation = chai.spy();
      const method = chai.spy();
      const args = {
        name: 'form',
        handleSuccess,
        handleSubmit,
        handleFailure,
        validator,
        handleValidation,
        method,
      };

      describe('handleSubmit', () => {
        it('runs', () => YaForm.submit(args).then(() => {
          expect(handleSubmit).to.have.been.called();
        }).should.be.fulfilled);

        it('rejects if function returns a value', () => YaForm.submit(
        Object.assign({}, args, { handleSubmit: () => false })
      ).then(() => {
        expect(handleFailure).to.have.been.called();
      }).should.be.rejected);
      });

      describe('validator', () => {
        it('runs', () => YaForm.submit(args).then(() => {
          expect(validator).to.have.been.called();
        }).should.be.fulfilled);

        it('rejects if function returns a value', () => YaForm.submit(
        Object.assign({}, args, { validator: () => false })
      ).then(() => {
        expect(handleValidation).to.have.been.called();
      }).should.be.rejected);

        it('should use global validator if set', () => {
          YaForm.config.validator = chai.spy();
          YaForm.submit(args).then(() => {
            expect(YaForm.config.validator).to.have.been.called();
          }).should.be.fulfilled;
        });
      });

      describe('method', () => {
        it('runs', () => YaForm.submit(args).then(() => {
          expect(method).to.have.been.called();
          expect(handleSuccess).to.have.been.called();
        }).should.be.fulfilled);

        it('rejects if function returns a value', () => YaForm.submit(
          Object.assign({}, args, { method: () => false })
        ).then(() => {
          expect(handleFailure).to.have.been.called();
        }).should.be.rejected);
      });
    });

    describe('getters', () => {
      it('getForm', () => {
        expect(YaForm.getForm('form')).to.deep.equal(baseForm);
      });
      it('getField', () => {
        expect(YaForm.getField('form', 'foo')).to.deep.equal(baseForm.fields.foo);
      });
      it('getError', () => {
        expect(YaForm.getError('form')).to.deep.equal(baseForm.error);
      });
    });
  });
});
