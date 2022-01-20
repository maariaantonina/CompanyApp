const Product = require('../product.model');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = undefined;

describe('Product', () => {
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
      const testProductOne = new Product({
        name: 'Product #1',
        client: 'Client #1',
      });
      await testProductOne.save();

      const testProductTwo = new Product({
        name: 'Product #2',
        client: 'Client #2',
      });
      await testProductTwo.save();
    });

    afterEach(async () => {
      await Product.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const products = await Product.find();
      const expectedLength = 2;
      expect(products.length).toEqual(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const product = await Product.findOne({
        name: 'Product #1',
      });
      expect(product.name).toEqual('Product #1');
    });

    it('should return a proper document by "client" with "findOne" method', async () => {
      const product = await Product.findOne({
        client: 'Client #1',
      });
      expect(product.client).toEqual('Client #1');
    });
  });

  describe('Creating data', () => {
    afterEach(async () => {
      await Product.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const product = new Product({ name: 'Product #1', client: 'Client #1' });
      await product.save();
      const savedProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(savedProduct).not.toBeNull();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testProductOne = new Product({
        name: 'Product #1',
        client: 'Client #1',
      });
      await testProductOne.save();

      const testProductTwo = new Product({
        name: 'Product #2',
        client: 'Client #1',
      });
      await testProductTwo.save();
    });

    afterEach(async () => {
      await Product.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Product.updateOne(
        { name: 'Product #1' },
        { $set: { name: '=Product #1=' } }
      );
      const updatedProduct = await Product.findOne({
        name: '=Product #1=',
      });
      expect(updatedProduct).not.toBeNull();
    });

    it('should properly update one document with "save" method', async () => {
      const product = await Product.findOne({ name: 'Product #1' });
      product.name = '=Product #1=';
      await product.save();

      const updatedProduct = await Product.findOne({
        name: '=Product #1=',
      });
      expect(updatedProduct).not.toBeNull();
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Product.updateMany({}, { $set: { name: 'Updated!' } });
      const products = await Product.find();
      expect(products[0].name).toEqual('Updated!');
      expect(products[1].name).toEqual('Updated!');
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testProductOne = new Product({
        name: 'Product #1',
        client: 'Client #1',
      });
      await testProductOne.save();

      const testProductTwo = new Product({
        name: 'Product #2',
        client: 'Client #2',
      });
      await testProductTwo.save();
    });

    afterEach(async () => {
      await Product.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Product.deleteOne({ name: 'Product #1' });
      const removeProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(removeProduct).toBeNull();
    });

    it('should properly remove one document with "remove" method', async () => {
      const product = await Product.findOne({ name: 'Product #1' });
      await product.remove();
      const removedProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(removedProduct).toBeNull();
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Product.deleteMany();
      const products = await Product.find();
      expect(products.length).toEqual(0);
    });
  });
});
