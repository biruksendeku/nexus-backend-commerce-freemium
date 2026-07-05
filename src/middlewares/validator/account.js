

// import packages
const { body } = require('express-validator');


// for updateProfile route
const updateProfile = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];



// for changePassword route
const changePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Password mismatch'),
];



// for addPassword route
const addPassword = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password mismatch'),
];



// for deleteAccount route
const deleteAccount = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];



// wrap them in an object
const accountValidator = {
  updateProfile,
  changePassword,
  addPassword,
  deleteAccount,
};


// export the object
module.exports = accountValidator;
