import { ApolloServer, gql } from "apollo-server";
const { schema } = require("@project-blipbug/api-schema");

import { resolvers } from "./resolvers";

// Import the .env file
require("dotenv").config();

const typeDefs = gql(schema.idl);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
