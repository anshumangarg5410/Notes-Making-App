const { GoogleGenerativeAI } = require('@google/generative-ai');
const environment = require('../config/environment');
const path = require('path');

class AiDrawingService {
  /**
   * Retrieves and cleans the Gemini API key, reloading from .env if necessary
   */
  getApiKey() {
    let key = (process.env.GEMINI_API_KEY || environment.gemini?.apiKey || '').replace(/["'\s]/g, '').trim();
    if (!key) {
      try {
        require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), override: true });
        key = (process.env.GEMINI_API_KEY || '').replace(/["'\s]/g, '').trim();
      } catch (_) {}
    }
    return key;
  }

  /**
   * Process a drawing / handwriting image using Google Gemini API
   * @param {Object} params
   * @param {string} params.image - Base64 data URL or raw base64 string
   * @param {string} [params.mimeType='image/png']
   * @param {string} [params.promptHint='']
   * @returns {Promise<Object>} Structured handwriting recognition & layout result
   */
  async cleanupDrawing({ image, mimeType = 'image/png', promptHint = '' }) {
    if (!image) {
      const error = new Error('Drawing image data is required for AI cleanup.');
      error.statusCode = 400;
      throw error;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error = new Error(
        'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in BackEnd/.env to enable Smart Ink AI cleanup.'
      );
      error.statusCode = 503;
      throw error;
    }

    // Extract raw base64 and actual mime type if present in data URL
    let cleanBase64 = image;
    let cleanMimeType = mimeType;

    const dataUrlMatch = image.match(/^data:([^;]+);base64,(.+)$/s);
    if (dataUrlMatch) {
      cleanMimeType = dataUrlMatch[1] || mimeType;
      cleanBase64 = dataUrlMatch[2];
    }

    // Strip any lingering whitespace or newlines
    cleanBase64 = cleanBase64.replace(/\s/g, '');

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fastest multimodal inference
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });

    const systemPrompt = `You are NoteNest's Smart Ink AI handwriting recognition engine.
Your mission is to transcribe, organize, and enhance the handwritten content and sketches in this image.

Instructions:
1. Carefully inspect the handwritten text, cursive writing, headings, bullet points, checklists, formulas, and diagrams.
2. Group the recognized text into logical reading order.
3. Formulate a clean, formatted Markdown representation of the notes with appropriate headings (#, ##), bullet points (- ), checklists (- [ ] or - [x]), bold text, and code/formula blocks where relevant.
4. Detect any simple diagrams or sketches (e.g. flowchart, box, arrow, circle, mindmap, table) and list them.
5. If the handwriting is messy or skewed, deduce the intended words using context and grammar.
${promptHint ? `User context/hint: "${promptHint}"` : ''}

Respond with a strictly valid JSON object matching this EXACT format:
{
  "title": "A short, descriptive 2-5 word title for the notes",
  "summary": "1-2 sentence concise summary of the handwritten content",
  "contentMarkdown": "# Heading\\n\\n- Clean bulleted note\\n- Another point\\n\\nParagraph text here...",
  "recognizedText": "Full plain text transcript of all handwriting",
  "detectedElements": ["heading", "checklist", "flowchart", "bullet_list"],
  "lineCount": 3
}

IMPORTANT: Return ONLY the JSON object. Do not wrap in markdown fences (\`\`\`json) and do not provide introductory or concluding conversational prose.`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: cleanMimeType
      }
    };

    let result;
    try {
      result = await model.generateContent([systemPrompt, imagePart]);
    } catch (apiError) {
      const errorMsg = apiError.message || 'Gemini API call failed';
      const error = new Error(`AI Handwriting Recognition error: ${errorMsg}`);
      error.statusCode = 502;
      throw error;
    }

    const responseText = result.response?.text() || '';

    // Clean JSON response (strip markdown fences if Gemini added them)
    let cleanedJsonText = responseText.trim();
    cleanedJsonText = cleanedJsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedJsonText);
    } catch (parseErr) {
      // Fallback: If parsing failed, construct structured object from raw text
      parsedData = {
        title: 'Handwritten Note',
        summary: 'Transcribed handwritten content',
        contentMarkdown: responseText,
        recognizedText: responseText,
        detectedElements: ['handwritten_text'],
        lineCount: responseText.split('\n').filter(Boolean).length
      };
    }

    return {
      success: true,
      data: {
        title: parsedData.title || 'Handwritten Notes',
        summary: parsedData.summary || 'Recognized handwritten notes and layout',
        contentMarkdown: parsedData.contentMarkdown || parsedData.recognizedText || '',
        recognizedText: parsedData.recognizedText || '',
        detectedElements: Array.isArray(parsedData.detectedElements) ? parsedData.detectedElements : [],
        lineCount: parsedData.lineCount || 1,
        processedAt: new Date().toISOString()
      }
    };
  }
}

module.exports = new AiDrawingService();
