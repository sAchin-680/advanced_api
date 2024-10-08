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
const compression = require('compression');
const { getProductById } = require('./controllers/productController');
const { getHerokuApps } = require('./herokuApi');
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);
app.use(compression());
const csrfProtection = csrf({ cookie: true });
app.get('/api/v1/products/:id', getProductById);

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

const main = async () => {
  try {
    const apps = await getHerokuApps(); // Call the function
    console.log(apps); // Log the response data
  } catch (error) {
    console.error('Failed to get Heroku apps:', error);
  }
};

// Run the main function
main();

setupSwagger(app);

module.exports = app;
