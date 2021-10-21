const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Product = require('../../../models/product.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/products', () => {
  before(async () => {
    const testDepOne = new Product({
      _id: '5d9f1140f10a81216cfd4408',
      name: 'Product #1',
      client: 'Client #1',
    });
    await testDepOne.save();
  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await request(server).delete(
      '/api/products/5d9f1140f10a81216cfd4408'
    );
    const deletedProduct = await Product.findOne({
      name: '#Product #1',
    });
    expect(res.status).to.be.equal(200);
    expect(deletedProduct).to.be.null;
  });

  after(async () => {
    await Product.deleteMany();
  });
});
