const { getProductById } = require('../controllers/productController');
const Product = require('../models/Product');

// Mock Product.findById to avoid hitting the database
jest.mock('../models/Product');

describe('Product Controller - getProductById', () => {
  it('should return a product if it exists', async () => {
    const req = { params: { id: '123' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Product.findById.mockResolvedValue({ _id: '123', name: 'Sample Product' });

    await getProductById(req, res);
    expect(res.json).toHaveBeenCalledWith({
      _id: '123',
      name: 'Sample Product',
    });
  });

  it('should return 404 if product is not found', async () => {
    const req = { params: { id: '123' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    Product.findById.mockResolvedValue(null);

    await getProductById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });
});
