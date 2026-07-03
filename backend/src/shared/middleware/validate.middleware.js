const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const messages = err.errors
      ? err.errors.map((e) => e.message).join(', ')
      : err.message;
    return res.status(400).json({
      success: false,
      message: `Validation failed: ${messages}`,
    });
  }
};

module.exports = validate;
