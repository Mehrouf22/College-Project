import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { cohereModel } from "../ai.service.js";

// Define the state for the docs generator workflow
const GraphState = Annotation.Root({
  topic: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  level: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  generatedDocs: Annotation({
    reducer: (x, y) => y ?? x,
  })
});

// Node function: Generate Docs
async function generateDocs(state) {
  const { topic, level } = state;
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a technical educator.

    Task:
    Convert complex topics into clean, structured notes.

    Input:
    - Topic: {topic}
    - Level: {level}

    Instructions:
    1. Explain in simple terms
    2. Use bullet points
    3. Add examples if needed
    4. Keep it concise but clear

    Output format:
    - Title
    - Explanation
    - Key Points
    - Example
  `);

  const chain = prompt.pipe(cohereModel).pipe(new StringOutputParser());
  
  const response = await chain.invoke({
    topic,
    level: level || "intermediate",
  });

  return { generatedDocs: response };
}

// Node function: Format Docs (Cleanup whitespace if any)
async function formatDocs(state) {
  const { generatedDocs } = state;
  return { generatedDocs: generatedDocs.trim() };
}

// Create the graph
const builder = new StateGraph(GraphState)
  .addNode("generate", generateDocs)
  .addNode("format", formatDocs)
  .addEdge(START, "generate")
  .addEdge("generate", "format")
  .addEdge("format", END);

export const docsGeneratorWorkflow = builder.compile();
