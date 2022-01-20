const Employee = require('../employee.model');
const Department = require('../department.model');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = undefined;

describe('Employee', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('Reading data', () => {
    beforeEach(async () => {
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
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: '5d9f1159f81ce8d1ef2bee38',
      });
      await testEmployeeTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      console.log(employees);
      const expectedLength = 2;
      expect(employees.length).toEqual(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'name1' });
      expect(employee.firstName).toEqual('name1');
    });

    it('should return a proper document by "department name" with "find" method', async () => {
      const department = await Department.find();
      const employee = await Employee.find().populate('department');
      expect(employee[0].department.name).toEqual('Depo1');
    });
  });

  describe('Creating data', () => {
    beforeAll(async () => {
      const testDepartment = new Department({ name: 'name1' });
      await testDepartment.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const department = await Department.findOne({ name: 'name1' });
      const employee = new Employee({
        firstName: 'name1',
        lastName: 'name1',
        department: department._id,
      });
      await employee.save();
      const savedEmployee = await Employee.findOne({
        firstName: 'name1',
      }).populate('department');
      expect(savedEmployee).not.toBeNull();
      expect(savedEmployee.department.name).toEqual('name1');
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
        department: testDepartmentId,
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: testDepartmentId2,
      });
      await testEmployeeTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'name1' },
        { $set: { firstName: '=name1=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=name1=',
      });
      expect(updatedEmployee).not.toBeNull();
    });

    it('should properly update one document with "updateOne" method - department info change', async () => {
      const department = await Department.findOne({ name: 'Department #2' });
      await Employee.updateOne(
        { firstName: 'name1' },
        { $set: { department: department._id } }
      );
      const updatedEmployee = await Employee.findOne({
        department: department._id,
      }).populate('department');
      expect(updatedEmployee).not.toBeNull();
      expect(updatedEmployee.department.name).toEqual('Department #2');
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'name2' });
      employee.firstName = '=name2=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=name2=',
      });
      expect(updatedEmployee).not.toBeNull();
    });

    it('should properly update one document with "save" method - department info change', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      const department2 = await Department.findOne({ name: 'Department #2' });
      const employee = await Employee.findOne({ department: department._id });
      employee.department = department2._id;
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        department: department2._id,
      });
      expect(updatedEmployee).not.toBeNull();
      expect(employee.department).toEqual(department2._id);
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find();
      expect(employees[0].firstName).toEqual('Updated!');
      expect(employees[1].firstName).toEqual('Updated!');
    });

    it('should properly update multiple documents with "updateMany" method - department info change', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      await Employee.updateMany({}, { $set: { department: department._id } });
      const employees = await Employee.find().populate('department');
      expect(employees[0].department.name).toEqual('Department #1');
      expect(employees[1].department.name).toEqual('Department #1');
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
        department: testDepartmentId,
      });
      await testEmployeeOne.save();
      const testEmployeeTwo = new Employee({
        firstName: 'name2',
        lastName: 'name2',
        department: testDepartmentId2,
      });
      await testEmployeeTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'name1' });
      const removeEmployee = await Employee.findOne({
        firstName: 'name1',
      });
      expect(removeEmployee).toBeNull();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      await Employee.deleteOne({ department: department._id });
      const removedEmployee = await Employee.findOne({
        department: department._id,
      });
      expect(removedEmployee).toBeNull();
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'name2' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'name2',
      });
      expect(removedEmployee).toBeNull();
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).toEqual(0);
    });
  });
});
