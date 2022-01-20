const Department = require('../department.model');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Department', () => {
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
    beforeAll(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    afterAll(async () => {
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      const expectedLength = 2;
      expect(departments.length).toEqual(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      expect(department.name).toEqual('Department #1');
    });
  });

  describe('Creating data', () => {
    afterAll(async () => {
      await Department.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const department = new Department({ name: 'Department #1' });
      await department.save();
      const savedDepartment = await Department.findOne({
        name: 'Department #1',
      });
      expect(savedDepartment).not.toBeNull();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne(
        { name: 'Department #1' },
        { $set: { name: '=Department #1=' } }
      );
      const updatedDepartment = await Department.findOne({
        name: '=Department #1=',
      });
      expect(updatedDepartment).not.toBeNull();
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      department.name = '=Department #1=';
      await department.save();

      const updatedDepartment = await Department.findOne({
        name: '=Department #1=',
      });
      expect(updatedDepartment).not.toBeNull();
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({}, { $set: { name: 'Updated!' } });
      const departments = await Department.find();
      expect(departments[0].name).toEqual('Updated!');
      expect(departments[1].name).toEqual('Updated!');
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({ name: 'Department #1' });
      const removeDepartment = await Department.findOne({
        name: 'Department #1',
      });
      expect(removeDepartment).toBeNull();
    });

    it('should properly remove one document with "remove" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      await department.remove();
      const removedDepartment = await Department.findOne({
        name: 'Department #1',
      });
      expect(removedDepartment).toBeNull();
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Department.deleteMany();
      const departments = await Department.find();
      expect(departments.length).toEqual(0);
    });
  });
});
