const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/employees', () => {
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
  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await request(server).delete(
      '/api/employees/5d9f1140f10a81216cfd4408'
    );
    const deletedEmployee = await Employee.findOne({
      _id: '5d9f1140f10a81216cfd4408',
    });

    expect(res.status).to.be.equal(200);
    expect(deletedEmployee).to.be.null;
  });
});
