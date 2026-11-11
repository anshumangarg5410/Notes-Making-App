import api from './api';

/**
 * Smart Ink AI Drawing Service
 * Communicates with backend Google Gemini AI endpoint for handwriting recognition
 */

/**
 * Send drawing image to Gemini AI for handwriting recognition & cleanup
 * @param {Object} params
 * @param {string} params.image - Base64 PNG data URI or raw base64 string
 * @param {string} [params.mimeType='image/png']
 * @param {string} [params.promptHint='']
 * @returns {Promise<Object>} Structured transcription and markdown
 */
export const cleanupDrawingWithAi = async ({ image, mimeType = 'image/png', promptHint = '' }) => {
  const response = await api.post('/drawing/ai-cleanup', {
    image,
    mimeType,
    promptHint
  });

  return response.data;
};

export default {
  cleanupDrawingWithAi
};

