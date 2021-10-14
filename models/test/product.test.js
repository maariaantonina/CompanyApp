const Product = require('../product.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Product', () => {
  it('should throw an error if any arg is missing', () => {
    const product1 = new Product({});
    const product2 = new Product({ name: 'concert' });
    const product3 = new Product({ client: 'Benny Hill' });
    const cases = [product1, product2, product3];
    for (let product of cases) {
      product.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if any arg is not a string', () => {
    const product1 = new Product({ name: 'concert', client: [] });
    const product2 = new Product({ name: [], client: 'Bobo Choses' });
    const cases = [product1, product2];
    for (let product of cases) {
      product.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if everything is OK', () => {
    const product = new Product({ name: 'concert', client: 'Coco Chanel' });
    product.validate((err) => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
