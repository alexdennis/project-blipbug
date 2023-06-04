import { ask } from "./lib/ask";

export const resolvers = {
  Query: {
    ask: async (
      _: unknown,
      {
        book,
        character,
        question,
      }: { book: string; character: string; question: string }
    ) => {
      const answer = await ask(book, character, question);
      return {
        answer,
      };
    },
  },
};
