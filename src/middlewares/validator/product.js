

// import packages
const { param, body, query } = require('express-validator'); // ← was "required"


// Shared validators
const paramId = [
  param('id')
    .notEmpty()
    .withMessage('Product id is required'),
];

const quantityBody = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required'),
];



// for products route
const products = [
  query('name')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt()
    .withMessage('Page must be a number'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1-100'),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'price_high', 'price_low'])
    .withMessage('Invalid sort option'),

  query('category')
    .optional()
    .trim(),
];



// for addToCart route
const addToCart = [...paramId, ...quantityBody];



// for updateCart route
const updateCart = [...paramId, ...quantityBody];



// for removeFromCart route
const removeFromCart = [...paramId];



// for singleOrderHistory route
const singleOrderHistory = [
  param('id')
    .notEmpty()
    .withMessage('Order ID is required'),
];



// for addToWishlist route
const addToWishlist = [
  param('id')
    .notEmpty()
    .withMessage('Product id is required'),
];



// wrap in one object
const productValidator = {
  products,
  addToCart,
  updateCart,
  removeFromCart,
  singleOrderHistory,
  addToWishlist,
};



// export the object
module.exports = productValidator;
