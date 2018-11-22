require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const middleware = require('./graphql/middleware/auth');

const schemaBuilder = module.require('./graphql/schemaBuilder');

const schema = schemaBuilder.buildAll();
schema.context = req => ({ ...req });
schema.middlewares = middleware;
const server = new GraphQLServer(schema);
const options = {
  port: process.env.GL_SERVER_PORT || 3000,
  endpoint: process.env.GL_SERVER_ENDPOINT || '/graphql',
  playground: '/test',
  context: req => ({ ...req }),
};

function serverStarted() {
  console.log(`Server listening on port ${options.port} at endpoint ${options.endpoint}`);
  if (options.playground) {
    console.log(`Playground is active at endpoint ${options.playground}`);
  }
}

server.start(options, serverStarted);
