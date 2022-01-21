const Department = require('../department.model.js');
const mongoose = require('mongoose');

jest.useFakeTimers();

describe('Department', () => {
  afterAll(() => {
    mongoose.models = {};
  });

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value
    dep.validate((err) => {
      expect(err.errors.name).not.toBeNull();
    });
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });
      dep.validate((err) => {
        expect(err.errors.name).not.toBeNull();
      });
    }
  });

  it('should throw an error if "name" has incorrect length', () => {
    const cases = ['a', 'Lorem ipsum lorem ipsum lorem'];
    for (let name of cases) {
      const dep = new Department({ name });
      dep.validate((err) => {
        expect(err.errors.name).not.toBeNull();
      });
    }
  });

  it('should not throw an error if "name is OK', () => {
    const cases = ['Engine Department', 'Human Resources'];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err).toBeNull();
      });
    }
  });
});
