const Product = require('../models/Product');

const resolvers = {
  Query: {
    getProduct: async (parent, args) => {
      return await Product.findById(args.id);
    },
    getProducts: async () => {
      return await Product.find({});
    },
  },
  Mutation: {
    createProduct: async (parent, args) => {
      const product = new Product({ name: args.name, price: args.price });
      return await product.save();
    },
  },
};

module.exports = resolvers;
