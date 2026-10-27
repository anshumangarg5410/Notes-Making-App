// Allowed color palette values
const ALLOWED_COLORS = ['default', 'cream', 'amber', 'rose', 'emerald', 'sky', 'purple'];

/**
 * Validate and sanitize note creation & update payload
 */
const validateNotePayload = (req, res, next) => {
  const { title, color, tags, isPinned, isFavorite, isArchived } = req.body;

  // Validate title length if provided
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Title must be a text string'
      });
    }
    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 150 characters'
      });
    }
  }

  // Validate color if provided
  if (color !== undefined) {
    if (!ALLOWED_COLORS.includes(color)) {
      return res.status(400).json({
        success: false,
        message: `Invalid color '${color}'. Allowed colors: ${ALLOWED_COLORS.join(', ')}`
      });
    }
  }

  // Validate tags if provided
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: 'Tags must be an array of strings'
      });
    }
    if (tags.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'A note cannot have more than 10 tags'
      });
    }
    for (const tag of tags) {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Each tag must be a non-empty string'
        });
      }
      if (tag.length > 30) {
        return res.status(400).json({
          success: false,
          message: 'Individual tag cannot exceed 30 characters'
        });
      }
    }
    // Clean and deduplicate tags
    req.body.tags = [...new Set(tags.map((t) => t.trim()))];
  }

  // Validate boolean flags if provided
  if (isPinned !== undefined && typeof isPinned !== 'boolean') {
    req.body.isPinned = Boolean(isPinned);
  }
  if (isFavorite !== undefined && typeof isFavorite !== 'boolean') {
    req.body.isFavorite = Boolean(isFavorite);
  }
  if (isArchived !== undefined && typeof isArchived !== 'boolean') {
    req.body.isArchived = Boolean(isArchived);
  }

  next();
};

module.exports = { validateNotePayload, ALLOWED_COLORS };
