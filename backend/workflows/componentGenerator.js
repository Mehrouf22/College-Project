import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { mistralModel } from "../ai.service.js";

// Define the state for the component generator workflow
const GraphState = Annotation.Root({
  component: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  style: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  framework: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  generatedCode: Annotation({
    reducer: (x, y) => y ?? x,
  })
});

// Node function: Generate Component
async function generateComponent(state) {
  const { component, style, framework } = state;
  
  const prompt = PromptTemplate.fromTemplate(`
    You are a frontend UI expert specializing in modern responsive design.

    Task:
    Generate clean, production-ready UI components.

    Input:
    - Component type: {component}
    - Style: {style}
    - Framework: {framework}

    Instructions:
    1. Generate:
      - Clean JSX code
      - Tailwind CSS styling (ensure to use modern utility classes)
    2. Ensure:
      - Responsive design
      - Modern UI/UX
    3. Keep code minimal and readable. If using icons, assume lucide-react is installed.

    Output format:
    Return ONLY code. No explanation. Do NOT wrap the code in markdown (\`\`\`jsx ... \`\`\`), just return the raw string.
  `);

  const chain = prompt.pipe(mistralModel).pipe(new StringOutputParser());
  
  const response = await chain.invoke({
    component,
    style,
    framework: framework || "React + Tailwind"
  });

  return { generatedCode: response };
}

// Node function: Format Code (Cleanup markdown if model inadvertently ignores instructions)
async function formatCode(state) {
  let { generatedCode } = state;
  
  // Cleanup markdown code blocks if any
  if (generatedCode.startsWith("\`\`\`")) {
    generatedCode = generatedCode.replace(/^\`\`\`(jsx|tsx|javascript|js)?\n/i, "");
    generatedCode = generatedCode.replace(/\`\`\`$/g, "");
  }

  return { generatedCode: generatedCode.trim() };
}

// Create the graph
const builder = new StateGraph(GraphState)
  .addNode("generate", generateComponent)
  .addNode("format", formatCode)
  .addEdge(START, "generate")
  .addEdge("generate", "format")
  .addEdge("format", END);

export const componentGeneratorWorkflow = builder.compile();
