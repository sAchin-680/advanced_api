const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const rateLimiter = require('./middlewares/rateLimiter');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);

const csrfProtection = csrf({ cookie: true });

app.use((req, res, next) => {
  if (req.path === '/graphql') {
    return next();
  }
  csrfProtection(req, res, next);
});

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
});

setupSwagger(app);

module.exports = app;
