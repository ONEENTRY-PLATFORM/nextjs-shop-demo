import { describe, expect, it } from '@jest/globals';

import formFieldsReducer, {
  addField,
} from '@/app/store/reducers/FormFieldsSlice';

/**
 * initial — fresh `formFieldsSlice` state via the reducer's `@@INIT` path.
 * @returns {ReturnType<typeof formFieldsReducer>} Initial form-fields-slice state.
 */
const initial = () => formFieldsReducer(undefined, { type: '@@INIT' });

describe('FormFieldsSlice — addField', () => {
  it('starts with an empty `fields` map', () => {
    expect(initial()).toEqual({ fields: {} });
  });

  it('adds a single field keyed by marker', () => {
    const state = formFieldsReducer(
      initial(),
      addField({ email: { value: 'a@b.cd', valid: true } }),
    );
    expect(state.fields).toEqual({ email: { value: 'a@b.cd', valid: true } });
  });

  it('replaces an existing field by marker (last write wins)', () => {
    let state = formFieldsReducer(
      initial(),
      addField({ email: { value: 'a@b.cd', valid: false } }),
    );
    state = formFieldsReducer(
      state,
      addField({ email: { value: 'new@x.io', valid: true } }),
    );
    expect(state.fields.email).toEqual({ value: 'new@x.io', valid: true });
  });

  it('preserves other fields when adding a new one', () => {
    let state = formFieldsReducer(
      initial(),
      addField({ email: { value: 'a@b.cd', valid: true } }),
    );
    state = formFieldsReducer(
      state,
      addField({ phone: { value: '+1', valid: false } }),
    );
    expect(state.fields).toEqual({
      email: { value: 'a@b.cd', valid: true },
      phone: { value: '+1', valid: false },
    });
  });

  it('only adds the first key in the payload (by design — getFirstKey)', () => {
    // The slice intentionally writes only one marker per dispatch. If a payload
    // contains multiple keys, the second one is dropped.
    const state = formFieldsReducer(
      initial(),
      addField({
        email: { value: 'a@b.cd', valid: true },
        phone: { value: '+1', valid: true },
      }),
    );
    const keys = Object.keys(state.fields);
    expect(keys).toHaveLength(1);
    // Iteration order of string-keyed objects is insertion order, so `email` wins here.
    expect(keys[0]).toBe('email');
  });

  it('is a noop for an empty payload', () => {
    const state = formFieldsReducer(initial(), addField({}));
    expect(state.fields).toEqual({});
  });
});
