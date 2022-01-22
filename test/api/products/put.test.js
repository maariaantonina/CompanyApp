const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Product = require('../../../models/product.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /api/products', () => {
  before(async () => {
    const testProductOne = new Product({
      _id: '5d9f1140f10a81216cfd4408',
      name: 'Product #1',
      client: 'Client #1',
    });
    await testProductOne.save();
  });

  after(async () => {
    await Product.deleteOne({ _id: '5d9f1140f10a81216cfd4408' });
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await request(server)
      .put('/api/products/5d9f1140f10a81216cfd4408')
      .send({ name: '#Product #1' });
    const updatedProduct = await Product.findOne({
      name: '#Product #1',
    });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(updatedProduct.name).to.be.equal('#Product #1');
  });
});
