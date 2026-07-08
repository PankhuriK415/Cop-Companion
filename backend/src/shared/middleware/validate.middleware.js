const validate = (schema) => (req, res, next) => {
  try {
    // Replace body with parsed output so defaults / transforms apply
    req.body = schema.parse(req.body);
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
