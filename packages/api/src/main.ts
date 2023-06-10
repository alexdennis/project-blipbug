import { ApolloServer, gql } from "apollo-server";
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
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
