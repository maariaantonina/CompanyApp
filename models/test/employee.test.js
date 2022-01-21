const Employee = require('../employee.model.js');
const mongoose = require('mongoose');

jest.useFakeTimers();

describe('Employee', () => {
  it('should throw an error if any arg is missing', () => {
    const employee0 = new Employee({});
    const employee1 = new Employee({
      firstName: 'Joe',
      department: '5d9f1159f81ce8d1ef2bee38',
    });
    const employee2 = new Employee({ firstName: 'Joe', lastName: 'Doe' });
    const employee3 = new Employee({
      lastName: 'Doe',
      department: '5d9f1159f81ce8d1ef2bee38',
    });

    const cases = [employee0, employee1, employee2, employee3];
    for (let employee of cases) {
      employee.validate((err) => {
        expect(err.errors).not.toBeNull();
      });
    }
  });

  it('should throw an error if any arg is not a string', () => {
    const employee1 = new Employee({
      firstName: 'Joe',
      lastName: [],
      department: 'HR',
    });
    const employee2 = new Employee({
      firstName: 'Joe',
      lastName: 'Doe',
      department: [],
    });
    const employee3 = new Employee({
      firstName: {},
      lastName: 'Doe',
      department: 'HR',
    });

    const cases = [employee1, employee2, employee3];
    for (let employee of cases) {
      employee.validate((err) => {
        expect(err.errors).not.toBeNull();
      });
    }
  });

  it('should not throw an error if everything is OK', () => {
    const employee1 = new Employee({
      firstName: 'Joe',
      lastName: 'Doe',
      department: '5d9f1159f81ce8d1ef2bee38',
    });
    employee1.validate((err) => {
      expect(err).toBeNull();
    });
  });
});
