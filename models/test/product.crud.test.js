const Product = require('../product.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Product', () => {
  before(async () => {
    try {
      const mongoServer = await MongoMemoryServer.create();

      mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
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

    it('should return all the data with "find" method', async () => {
      const products = await Product.find();
      const expectedLength = 2;
      expect(products.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const product = await Product.findOne({
        name: 'Product #1',
      });
      expect(product.name).to.be.equal('Product #1');
    });

    it('should return a proper document by "client" with "findOne" method', async () => {
      const product = await Product.findOne({
        client: 'Client #1',
      });
      expect(product.client).to.be.equal('Client #1');
    });

    after(async () => {
      await Product.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const product = new Product({ name: 'Product #1', client: 'Client #1' });
      await product.save();
      const savedProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(savedProduct).to.not.be.null;
    });

    after(async () => {
      await Product.deleteMany();
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

    it('should properly update one document with "updateOne" method', async () => {
      await Product.updateOne(
        { name: 'Product #1' },
        { $set: { name: '=Product #1=' } }
      );
      const updatedProduct = await Product.findOne({
        name: '=Product #1=',
      });
      expect(updatedProduct).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const product = await Product.findOne({ name: 'Product #1' });
      product.name = '=Product #1=';
      await product.save();

      const updatedProduct = await Product.findOne({
        name: '=Product #1=',
      });
      expect(updatedProduct).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Product.updateMany({}, { $set: { name: 'Updated!' } });
      const products = await Product.find();
      expect(products[0].name).to.be.equal('Updated!');
      expect(products[1].name).to.be.equal('Updated!');
    });

    afterEach(async () => {
      await Product.deleteMany();
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

    it('should properly remove one document with "deleteOne" method', async () => {
      await Product.deleteOne({ name: 'Product #1' });
      const removeProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(removeProduct).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const product = await Product.findOne({ name: 'Product #1' });
      await product.remove();
      const removedProduct = await Product.findOne({
        name: 'Product #1',
      });
      expect(removedProduct).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Product.deleteMany();
      const products = await Product.find();
      expect(products.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Product.deleteMany();
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
