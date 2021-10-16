const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Employee = require('../../../models/employee.model');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/employees', () => {
  before(async () => {
    const testDepOne = new Department({
      name: 'Depo1',
      _id: '5d9f1140f10a81216cfd4408',
    });
    await testDepOne.save();

    const testDepTwo = new Department({
      name: 'Depo2',
      _id: '5d9f1159f81ce8d1ef2bee38',
    });
    await testDepTwo.save();

    const testEmployeeOne = new Employee({
      firstName: 'name1',
      lastName: 'name1',
      department: '5d9f1140f10a81216cfd4408',
      _id: '5d9f1140f10a81216cfd44aa',
    });
    await testEmployeeOne.save();

    const testEmployeeTwo = new Employee({
      firstName: 'name2',
      lastName: 'name2',
      department: '5d9f1159f81ce8d1ef2bee38',
      _id: '5d9f1140f10a81216cfd44bb',
    });
    await testEmployeeTwo.save();
  });

  it('/ should return all employees', async () => {
    const res = await request(server).get('/api/employees');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });

  it('/:id should return one employee by :id', async () => {
    const res = await request(server).get(
      '/api/employees/5d9f1140f10a81216cfd44bb'
    );
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  it('/random should return one random employee', async () => {
    const res = await request(server).get('/api/employees/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  after(async () => {
    await Department.deleteMany();
  });
});
