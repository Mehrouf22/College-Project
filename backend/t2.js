import { componentGeneratorWorkflow } from './workflows/componentGenerator.js';

async function run() {
  try {
    const r = await componentGeneratorWorkflow.invoke({
      component: "Button",
      style: "Tailwind Dark",
      framework: "React"
    });
    console.log(JSON.stringify(r));
  } catch (e) {
    console.error("MISTRAL ERROR:");
    console.error(e.message);
  }
}
run();
