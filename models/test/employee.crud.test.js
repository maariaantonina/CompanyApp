const Employee = require('../employee.model');
const Department = require('../department.model');

const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();

      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testDepOne = new Department({
        _id: '5d9f1140f10a81216cfd4408',
        name: 'Department #1'
      });
      await testDepOne.save();

      const testDepTwo = new Department({
        _id: '5d9f1159f81ce8d1ef2bee48',
        name: 'Department #2'
      });
      await testDepTwo.save();

      const testEmployeeOne = new Employee({
        firstName: 'name1',
        lastName: 'name1',
        department: '5d9f1140f10a81216cfd4408'
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: '5d9f1159f81ce8d1ef2bee48'
      });
      await testEmployeeTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'name1' });
      expect(employee.firstName).to.be.equal('name1');
    });

    it('should return a proper document by "department" with "findOne" method', async () => {
      const employee = await Employee.findOne()
        .populate({
          path: 'department',
          match: { name: 'Department #1' }
        })
        .exec();
      expect(employee.department.name).to.be.equal('Department #1');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    before(async () => {
      const testDepartment = new Department({ name: 'name1' });
      await testDepartment.save();
    });

    it('should insert new document with "insertOne" method', async () => {
      const department = await Department.findOne({ name: 'name1' });
      const employee = new Employee({
        firstName: 'name1',
        lastName: 'name1',
        department: department._id
      });
      await employee.save();
      const savedEmployee = await Employee.findOne({
        firstName: 'name1'
      });
      expect(savedEmployee).to.not.be.null;
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
      const testDepartmentId = testDepOne._id;

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
      const testDepartmentId2 = testDepTwo._id;

      const testEmployeeOne = new Employee({
        firstName: 'name1',
        lastName: 'name1',
        department: testDepartmentId
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: testDepartmentId2
      });
      await testEmployeeTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'name1' },
        { $set: { firstName: '=name1=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=name1='
      });
      expect(updatedEmployee).to.not.be.null;
    });

    // it('should properly update one document with "updateOne" method - department info change', async () => {
    //   const department = await Department.findOne({ name: 'Department #2' });
    //   await Employee.updateOne(
    //     { firstName: 'name1' },
    //     { $set: { department: department._id } }
    //   );
    //   const updatedEmployee = await Employee.findOne({
    //     department: department._id
    //   });
    //   expect(updatedEmployee).to.not.be.null;
    // });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'name2' });
      employee.firstName = '=name2=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=name2='
      });
      expect(updatedEmployee).to.not.be.null;
    });

    // it('should properly update one document with "save" method - department info change', async () => {
    //   const department = await Department.findOne({ name: 'Department #1' });
    //   const department2 = await Department.findOne({ name: 'Department #2' });
    //   const employee = await Employee.findOne({ department: department._id });
    //   employee.department = department2._id;
    //   await employee.save();

    //   const updatedEmployee = await Employee.findOne({
    //     department: department2._id
    //   });
    //   expect(updatedEmployee).to.not.be.null;
    //   expect(employee.department).to.be.equal(department2._id);
    // });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('Updated!');
      expect(employees[1].firstName).to.be.equal('Updated!');
    });

    // it('should properly update multiple documents with "updateMany" method - department info change', async () => {
    //   const department = await Department.findOne({ name: 'Department #1' });
    //   await Employee.updateMany({}, { $set: { department: department._id } });
    //   const employees = await Employee.find().populate('department');
    //   expect(employees[0].department).to.be.equal(department._id);
    //   expect(employees[1].department).to.be.equal(department._id);
    // });

    afterEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
      const testDepartmentId = testDepOne._id;

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
      const testDepartmentId2 = testDepTwo._id;

      const testEmployeeOne = new Employee({
        firstName: 'name1',
        lastName: 'name1',
        department: testDepartmentId
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: testDepartmentId2
      });
      await testEmployeeTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'name1' });
      const removeEmployee = await Employee.findOne({
        firstName: 'name1'
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      await Employee.deleteOne({ department: department._id });
      const removedEmployee = await Employee.findOne({
        department: department._id
      });
      expect(removedEmployee).to.be.null;
    });

    // it('should properly remove one document with "remove" method', async () => {
    //   const employee = await Employee.findOne({ firstName: 'name2' });
    //   await employee.remove();
    //   const removedEmployee = await Employee.findOne({
    //     firstName: 'name2'
    //   });
    //   expect(removedEmployee).to.be.null;
    // });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });
  });
});
