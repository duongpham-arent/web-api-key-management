import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Define schema for structured output
const outputSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("Interesting facts extracted from the repository")
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that summarizes GitHub repositories."],
  ["human", `
Summarize this github repository from this readme file content.
Provide a concise summary and extract interesting facts.

README CONTENT:
{readmeContent}
`]
]);

export async function summarizeGithubRepo(readmeContent) {
  const model = new ChatOpenAI({ 
    modelName: "gpt-3.5-turbo-0125",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: 500
  }).withStructuredOutput(outputSchema);

  const chain = RunnableSequence.from([
    {
      readmeContent: (input) => input.readmeContent
    },
    prompt,
    model
  ]);

  const result = await chain.invoke({
    readmeContent
  });

  return result;
} 