const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/employees', () => {
  before(async () => {
    const testDepartment = new Department({ name: 'Dep1' });
    await testDepartment.save();
  });

  it('/ should insert new document to db and return success', async () => {
    const testDepartment = await Department.findOne({ name: 'Dep1' });
    const res = await request(server).post('/api/employees').send({
      firstName: 'Klara',
      lastName: 'Montana',
      department: testDepartment._id,
    });
    const newEmployee = await Employee.findOne({
      firstName: 'Klara',
      lastName: 'Montana',
      department: testDepartment._id,
    });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newEmployee).to.not.be.null;
  });

  after(async () => {
    await Department.deleteMany();
    await Employee.deleteMany();
  });
});
