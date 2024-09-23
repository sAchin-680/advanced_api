const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

// Mock the Product model
jest.mock('../models/Product');

describe('GET /api/v1/products/:id', () => {
  afterEach(() => {
    // Clear mocks after each test to avoid interference
    jest.clearAllMocks();
  });

  it('should return a product by id', async () => {
    // Mock Product.findById to resolve a valid product
    Product.findById.mockResolvedValue({ _id: '123', name: 'Sample Product' });

    const res = await request(app).get('/api/v1/products/123');

    // Ensure the correct status and product data
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', '123');
    expect(res.body).toHaveProperty('name', 'Sample Product');
  });

  it('should return 404 if product is not found', async () => {
    // Mock Product.findById to return null (product not found)
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/v1/products/123');

    // Ensure 404 status and proper error message
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Product not found' });
  });
});
