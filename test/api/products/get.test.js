const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Product = require('../../../models/product.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/products', () => {
  before(async () => {
    const testProductOne = new Product({
      _id: '5d9f1140f10a81216cfd4408',
      name: 'Product #1',
      client: 'Client #1',
    });
    await testProductOne.save();

    const testProductTwo = new Product({
      _id: '5d9f1159f81ce8d1ef2bee48',
      name: 'Product #2',
      client: 'Client #2',
    });
    await testProductTwo.save();
  });

  after(async () => {
    await Product.deleteMany({
      _id: { $in: ['5d9f1140f10a81216cfd4408', '5d9f1159f81ce8d1ef2bee48'] },
    });
  });

  it('/ should return all products', async () => {
    const res = await request(server).get('/api/products');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    //expect(res.body.length).to.be.equal(2);
  });

  it('/:id should return one product by :id ', async () => {
    const res = await request(server).get(
      '/api/products/5d9f1159f81ce8d1ef2bee48'
    );
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });

  it('/random should return one random product', async () => {
    const res = await request(server).get('/api/products/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });
});
