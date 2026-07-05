

// import packages
const rateLimit = require('express-rate-limit');


// if you need advanced features check the premium version
const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 50,
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});


// export it
module.exports = basicLimiter;
