const aiDrawingService = require('../services/aiDrawing.service');

class AiDrawingController {
  /**
   * POST /api/drawing/ai-cleanup
   * Perform Gemini-powered handwriting recognition & cleanup
   */
  async cleanupDrawing(req, res, next) {
    try {
      const { image, mimeType, promptHint } = req.body;

      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Drawing image (base64) is required.'
        });
      }

      const result = await aiDrawingService.cleanupDrawing({
        image,
        mimeType,
        promptHint
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AiDrawingController();

