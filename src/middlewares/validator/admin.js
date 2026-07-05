

// import packages
const { body, query, param } = require('express-validator');

// custom validator to sanitize input
const sanitizeInput = require('../../utils/string/sanitize');


// Shared pagination/sort validators to avoid structuredClone
const listQueryValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1-100'),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'price_high', 'price_low'])
    .withMessage('Invalid sort option'),
];



// for createProduct route
const createProduct = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat()
    .withMessage('Price must be a number'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt()
    .withMessage('Quantity must be a number'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('deliveryTime')
    .optional()
    .matches(/^\d+-\d+\s+(?:days|hours|weeks)$/)
    .withMessage('Invalid delivery time format (e.g., "2-3 days")'),

  body('productInfo')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Product info cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['in stock', 'out of stock', 'pre-order'])
    .withMessage('Invalid product status value'),
];



// for getAllProducts route
const getAllProducts = [
  ...listQueryValidators,

  query('name')
    .optional()
    .trim(),

  query('category')
    .optional()
    .trim(),
];



// for getOneProduct route
const getOneProduct = [
  param('id')
    .notEmpty()
    .withMessage('Invalid product id'),
];


// for getAllOrders route
const getAllOrders = [
  ...listQueryValidators,
];


// for updateProduct route
const updateProduct = [
  param('id')
    .notEmpty()
    .withMessage('Invalid product ID'),

  body('name')
    .optional()
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .optional()
    .isFloat()
    .withMessage('Price must be a number'),

  body('quantity')
    .optional()
    .isInt()
    .withMessage('Quantity must be a number'),

  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category is required'),

  body('deliveryTime')
    .optional()
    .matches(/^\d+-\d+\s+(?:days|hours|weeks)$/)
    .withMessage('Invalid delivery time format'),

  body('productInfo')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Product info cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['in stock', 'out of stock', 'pre-order'])
    .withMessage('Invalid status value'),

  body('deleteImages')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Delete-Images must be an array'),

  body('order')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Order must be an array'),
    

  // custom validation for image limit
  body().custom((value, { req }) => {
    const currentImages = req.product?.images?.length || 0;
    const newImages = req.files?.length || 0;
    const deletedImages = (req.body.deleteImages || []).length;

    const finalImageCount = currentImages - deletedImages + newImages;

    if (finalImageCount > parseInt(process.env.MAX_IMAGE_LIMIT)) {
      throw new Error(`Total images cannot exceed ${process.env.MAX_IMAGE_LIMIT} (would be ${finalImageCount})`);
    }

    if (finalImageCount < 1) {
      throw new Error('Product must have at least one image');
    }

    return true;
  }),
];



// for deleteProduct route
const deleteProduct = [
  param('id')
    .notEmpty()
    .withMessage('Invalid product ID'),
];


// wrap in one object
const adminValidator = {
  createProduct,
  getAllProducts,
  getOneProduct,
  getAllOrders,
  updateProduct,
  deleteProduct,
};



// export the validator
module.exports = adminValidator;
