

// import packages
const { body } = require('express-validator');


// create the validator and exporting it
const createPayment = [
  body('items')
    .notEmpty()
    .withMessage('Items is required'),
  
  body('items.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  
  body('items.*.quantity')
    .isInt()
    .withMessage('Quantity must be a number'),
  
  body('items.*.variant')  // Optional: if products have variants (size, color)
    .optional()
    .isString()
    .withMessage('Variant must be a string'),
  
  body('shippingAddress')
    .optional()
    .isObject()
    .withMessage('Shipping address must be an object'),
  
  body('shippingAddress.street')
    .optional()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .optional()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.state')
    .optional()
    .notEmpty()
    .withMessage('State is required'),
  
  body('shippingAddress.zipCode')
    .optional()
    .matches(/^[0-9]{4,10}$/)
    .withMessage('Invalid zip code format'),
  
  body('shippingAddress.country')
    .optional()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('couponCode')  // optional: discount coupons
    .optional()
    .isString()
    .withMessage('Invalid coupon code'),
  
  body('notes')  // optional: customer notes
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be under 500 characters')
];



// wrap in object for consistent structure
const paymentValidator = {
	createPayment
};


// export the object
module.exports = paymentValidator;
