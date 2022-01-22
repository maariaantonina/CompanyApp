const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /api/employees', () => {
  before(async () => {
    const testDepartment = new Department({ name: 'Dep1' });
    await testDepartment.save();

    const testEmployee = new Employee({
      firstName: 'Klara',
      lastName: 'Montana',
      department: testDepartment._id,
      _id: '5d9f1140f10a81216cfd4408',
    });
    await testEmployee.save();
  });

  after(async () => {
    await Department.deleteOne({ name: 'Dep1' });
    await Employee.deleteMany({ _id: '5d9f1140f10a81216cfd4408' });
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await request(server)
      .put('/api/employees/5d9f1140f10a81216cfd4408')
      .send({
        firstName: 'Ala',
      });
    const updatedEmployee = await Employee.findOne({
      _id: '5d9f1140f10a81216cfd4408',
    });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(updatedEmployee.firstName).to.be.equal('Ala');
  });
});
