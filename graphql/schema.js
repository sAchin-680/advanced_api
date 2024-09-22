const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    price: Float!
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product]
  }

  type Mutation {
    createProduct(name: String!, price: Float!): Product
  }
`;

module.exports = typeDefs;
