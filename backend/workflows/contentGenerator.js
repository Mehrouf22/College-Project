import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { geminiModel } from "../ai.service.js";

// Define the state for the content generator workflow
const GraphState = Annotation.Root({
  websiteType: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  audience: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  tone: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  sections: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  generatedContent: Annotation({
    reducer: (x, y) => y ?? x,
  }),
  jsonOutput: Annotation({
    reducer: (x, y) => y ?? x,
  })
});

// Node function: Generate Content
async function generateContent(state) {
  const { websiteType, audience, tone, sections } = state;
  
  const prompt = PromptTemplate.fromTemplate(`
    You are an expert website content writer for modern web developers and freelancers.
    Your task is to generate high-quality, conversion-focused website content.

    Input:
    - Website type: {websiteType}
    - Target audience: {audience}
    - Tone: {tone}
    - Sections required: {sections}

    Instructions:
    1. Generate content for each section:
      - Hero section (headline + subheading + CTA)
      - About section
      - Services section
      - Footer tagline

    2. Keep it:
      - Clear, modern, and engaging
      - Not too long, not too short
      - SEO-friendly

    3. Output format:
    Return JSON ONLY:
    {{
      "hero": {{ "headline": "", "subtext": "", "cta": "" }},
      "about": "",
      "services": ["", "", ""],
      "footer": ""
    }}
  `);

  const chain = prompt.pipe(geminiModel).pipe(new StringOutputParser());
  
  const response = await chain.invoke({
    websiteType,
    audience,
    tone,
    sections: sections.join(", ")
  });

  return { generatedContent: response };
}

// Node function: Format Output (Ensure JSON cleanup)
async function formatOutput(state) {
  const { generatedContent } = state;
  
  let jsonString = generatedContent;
  // Cleanup markdown code blocks if any
  if (jsonString.startsWith("\`\`\`json")) {
    jsonString = jsonString.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "");
  } else if (jsonString.startsWith("\`\`\`")) {
    jsonString = jsonString.replace(/\`\`\`/g, "");
  }

  try {
    const jsonOutput = JSON.parse(jsonString.trim());
    return { jsonOutput };
  } catch (err) {
    console.error("Failed to parse JSON", err);
    return { jsonOutput: { error: "Failed to parse content as JSON", raw: generatedContent } };
  }
}

// Create the graph
const builder = new StateGraph(GraphState)
  .addNode("generate", generateContent)
  .addNode("format", formatOutput)
  .addEdge(START, "generate")
  .addEdge("generate", "format")
  .addEdge("format", END);

export const contentGeneratorWorkflow = builder.compile();
