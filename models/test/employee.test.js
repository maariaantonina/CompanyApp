const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if any arg is missing', () => {
    const employee0 = new Employee({});
    const employee1 = new Employee({ firstName: 'Joe', department: 'HR' });
    const employee2 = new Employee({ firstName: 'Joe', lastName: 'Doe' });
    const employee3 = new Employee({ lastName: 'Doe', department: 'HR' });

    const cases = [employee0, employee1, employee2, employee3];
    for (let employee of cases) {
      employee.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if any arg is not a string', () => {
    const employee1 = new Employee({
      firstName: 'Joe',
      lastName: [],
      department: 'HR'
    });
    const employee2 = new Employee({
      firstName: 'Joe',
      lastName: 'Doe',
      department: []
    });
    const employee3 = new Employee({
      firstName: {},
      lastName: 'Doe',
      department: 'HR'
    });

    const cases = [employee1, employee2, employee3];
    for (let employee of cases) {
      employee.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if everything is OK', () => {
    const employee1 = new Employee({
      firstName: 'Joe',
      lastName: 'Doe',
      department: 'HR'
    });
    employee1.validate(err => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
