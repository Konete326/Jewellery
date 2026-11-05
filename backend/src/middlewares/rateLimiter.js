import rateLimit from 'express-rate-limit';

const getAuthMax = () => {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_AUTH_RATE_LIMIT) {
    return Number(process.env.TEST_AUTH_RATE_LIMIT);
  }
  return 10;
};

const getOrderMax = () => {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_ORDER_RATE_LIMIT) {
    return Number(process.env.TEST_ORDER_RATE_LIMIT);
  }
  return 30;
};

const getTrackingMax = () => {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_TRACKING_RATE_LIMIT) {
    return Number(process.env.TEST_TRACKING_RATE_LIMIT);
  }
  return 20;
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: getAuthMax,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  }
});

export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: getOrderMax,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many order submissions. Please try again later.'
    });
  }
});

export const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: getTrackingMax,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many order tracking attempts. Please try again after 15 minutes.'
    });
  }
});

