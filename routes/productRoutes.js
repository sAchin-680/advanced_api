const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for creating a product
router.post(
  '/',
  protect,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  createProduct
);

// Route for getting all products
router.get('/', getProducts);

// Route for getting a single product by ID
router.get('/:id', getProductById);

// Route for updating a product
router.put(
  '/:id',
  protect,
  [
    body('name').optional().not().isEmpty().withMessage('Name cannot be empty'),
    body('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  updateProduct
);

// Route for deleting a product
router.delete('/:id', protect, deleteProduct);

module.exports = router;
