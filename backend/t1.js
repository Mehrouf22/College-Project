import { contentGeneratorWorkflow } from './workflows/contentGenerator.js';

async function run() {
  try {
    const r = await contentGeneratorWorkflow.invoke({
      websiteType: "SaaS",
      audience: "Developers",
      tone: "Professional",
      sections: ["Hero"]
    });
    console.log(JSON.stringify(r));
  } catch (e) {
    console.error("ERROR CAUGHT:");
    console.error(e);
  }
}
run();
