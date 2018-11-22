const path = require('path');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

class SchemaBuilder {
  constructor() {
    this.typePath = path.join(__dirname, './types');
    // this.enumPath = path.join(__dirname, './enums');
    this.resolverPath = path.join(__dirname, './resolvers');
    this.queryPath = path.join(__dirname, './queries');
    this.mutationPath = path.join(__dirname, './mutations');
    this.types = fileLoader(this.typePath);
    // this.enums = fileLoader(this.enumPath);
    this.queries = fileLoader(this.queryPath);
    this.mutation = fileLoader(this.mutationPath);
    this.resolvers = fileLoader(this.resolverPath);
  }
  buildAll() {
    this.typeDefs = mergeTypes([...this.types, ...this.queries, ...this.mutation], { all: true });
    this.resolvers = mergeResolvers(this.resolvers);
    return {
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
    };
  }
}

module.exports = new SchemaBuilder();
