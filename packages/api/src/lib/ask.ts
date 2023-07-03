const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");

export const ask = async (
  book: string,
  character: string,
  question: string,
  audience?: string
): Promise<string | undefined> => {
  console.info({ book, character, question });
  const llmChain = createChain();
  const res = await llmChain.call({
    character,
    book,
    question,
    audience: audience ?? "a Human Being",
  });
  console.info({ res });

  if (res.error) {
    console.error(res.error);
    throw new Error(res.error);
  } else if (res.text) {
    console.log(res.text);
    return res.text;
  }

  return undefined;
};

/**
 * Chreate a new LLMChain
 *
 * @param temperature Default 0 to give deterministic results
 * @returns
 */
function createChain(temperature: number = 0) {
  const chat = new ChatOpenAI({ temperature });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are a chatbot designed to give users the ability to talk to characters in any book. Play the role of {character} in the {book}.  
    Don't break out of character. Please give chapter and verse numbers that validate your answers where possible. Don't refer to yourself in the third person.
    Respond in less than 500 words and avoid repetition. Answer as if I am {audience}.`
    ),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);
  return new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });
}
