const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Product = require('../../../models/product.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/products', () => {
  it('/ should insert new document to db and return success', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({ name: '#product #1', client: '#client #1' });
    const newproduct = await Product.findOne({ name: '#product #1' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newproduct).to.not.be.null;
  });

  after(async () => {
    await Product.deleteMany();
  });
});
