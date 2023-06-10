import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const { schema } = require("@project-blipbug/api-schema");

import { resolvers } from "./resolvers";

// Import the .env file
require("dotenv").config();

const typeDefs = gql(schema.idl);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    database: new DynamoDBClient({ region: process.env.AWS_REGION }),
    tableName: process.env.DATABASE_TABLE_NAME,
  },

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

exports.handler = server.createHandler();
