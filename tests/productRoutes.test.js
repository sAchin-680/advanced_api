const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

jest.mock('../models/Product');

describe('GET /api/v1/products/:id', () => {
  it('should return a product by id', async () => {
    Product.findById.mockResolvedValue({ _id: '123', name: 'Sample Product' });

    const res = await request(app).get('/api/v1/products/123');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '123');
    expect(res.body).toHaveProperty('name', 'Sample Product');
  });

  it('should return 404 if product is not found', async () => {
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/v1/products/123');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });
});
