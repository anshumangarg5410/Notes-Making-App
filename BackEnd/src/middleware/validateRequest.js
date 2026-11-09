const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));

        return res.status(400).json({
          success: false,
          message: error.errors[0]?.message || 'Validation error',
          errors: errorMessages
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }
  };
};

module.exports = validateRequest;
