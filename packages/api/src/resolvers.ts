import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ask } from "./lib/ask";

export const resolvers = {
  Query: {
    ask: async (
      _: unknown,
      {
        book,
        character,
        question,
      }: { book: string; character: string; question: string },
      { database, tableName }: { database: DynamoDBClient; tableName: string }
    ) => {
      const answer = await ask(book, character, question);
      await logToDB(database, tableName, book, character, question, answer);
      return {
        answer,
      };
    },
  },
};

async function logToDB(
  database: DynamoDBClient,
  tableName: string,
  book: string,
  character: string,
  question: string,
  answer: string | undefined
) {
  const params = {
    TableName: tableName,
    Item: {
      pk: { S: uuidv4() }, // Random ID
      sk: { S: new Date().toISOString() },
      book: { S: book },
      character: { S: character },
      question: { S: question },
      answer: { S: JSON.stringify(answer) },
    },
  };
  console.log(JSON.stringify(params, null, 2));
  const command = new PutItemCommand(params);

  try {
    await database.send(command);
  } catch (error) {
    // error handling.
    console.error(JSON.stringify(error, null, 2));
  } finally {
    // finally.
  }
}
