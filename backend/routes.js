import express from 'express';
import { contentGeneratorWorkflow } from './workflows/contentGenerator.js';
import { componentGeneratorWorkflow } from './workflows/componentGenerator.js';
import { docsGeneratorWorkflow } from './workflows/docsGenerator.js';
import { generateInvoicePDF } from './services/invoiceGenerator.js';

const router = express.Router();
const memoryHistory = [];

// Content AI Route
router.post('/generate-content', async (req, res) => {
  try {
    const { websiteType, audience, tone, sections } = req.body;
    
    const result = await contentGeneratorWorkflow.invoke({
      websiteType: websiteType || "Portfolio",
      audience: audience || "Clients",
      tone: tone || "Professional",
      sections: sections || ["Hero", "About", "Services", "Footer"]
    });
    
    memoryHistory.unshift({ featureType: 'content', promptData: req.body, resultData: result.jsonOutput, createdAt: new Date() });
    
    res.json({ success: true, data: result.jsonOutput });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Component Generator AI Route (Mistral)
router.post('/generate-component', async (req, res) => {
  try {
    const { component, style, framework } = req.body;
    
    const result = await componentGeneratorWorkflow.invoke({
      component: component || "Hero Section",
      style: style || "Modern, minimalist",
      framework: framework || "React + Tailwind"
    });
    
    memoryHistory.unshift({ featureType: 'component', promptData: req.body, resultData: result.generatedCode, createdAt: new Date() });
    
    res.json({ success: true, data: result.generatedCode });
  } catch (error) {
    console.error("Error generating component:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Docs AI Route (Cohere)
router.post('/generate-docs', async (req, res) => {
  try {
    const { topic, level } = req.body;
    
    const result = await docsGeneratorWorkflow.invoke({
      topic: topic || "React Server Components",
      level: level || "intermediate"
    });
    
    memoryHistory.unshift({ featureType: 'docs', promptData: req.body, resultData: result.generatedDocs, createdAt: new Date() });
    
    res.json({ success: true, data: result.generatedDocs });
  } catch (error) {
    console.error("Error generating docs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Invoice Generator Route (No AI - Puppeteer PDF)
router.post('/generate-invoice', async (req, res) => {
  try {
    const data = req.body;
    
    const base64Pdf = await generateInvoicePDF(data);
    
    memoryHistory.unshift({ featureType: 'invoice', promptData: data, resultData: { generated: true }, createdAt: new Date() });
    
    res.json({ success: true, data: { base64: base64Pdf } });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch History
router.get('/history', (req, res) => {
  res.json({ success: true, data: memoryHistory.slice(0, 50) });
});

export default router;
