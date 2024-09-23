const Product = require('../models/Product');
const redisClient = require('../config/redisClient');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public or Admin (adjust based on your needs)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validate inputs
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new product
    const product = new Product({
      name,
      description,
      price,
      category,
    });

    // Save product to the database
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products with pagination & filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10; // Default page size is 10
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // Case-insensitive search
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Public or Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Public or Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cache the product in Redis for future requests
    await redisClient.setEx(
      `product:${product._id}`,
      3600, // 1 hour expiry
      JSON.stringify(product)
    );

    // Return the product
    res.status(200).json(product);
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
