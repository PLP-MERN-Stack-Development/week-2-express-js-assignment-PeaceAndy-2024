// Logger Middleware - logs method, url, timestamp
const logger = (req, res, next) => {
  console.log(`req.method{req.originalUrl} - ${new Date().toISOString()}`);
  next();
};

// Auth Middleware - checks for API key header
const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'my-secret-key') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Validation Middleware - validates product input fields
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }
  next();
};

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Global Error Handling Middleware
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
  });
}

// Async handler to catch async errors in routes
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  logger,
  auth,
  validateProduct,
  NotFoundError,
  ValidationError,
  errorHandler,
  asyncHandler,
};

    
