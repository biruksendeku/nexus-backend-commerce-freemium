

// import packages
const { body, param } = require('express-validator');
const User = require('../../models/user');


// for forgotPassword route
const forgotPassword = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new Error('Incorrect email address, make sure you entered the correct email');
      }
      return true;
    }),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required'),
];



// for getResetToken route
const getResetToken = [
  param('token')
    .notEmpty()
    .withMessage('Token is required'),
];



// wrap in one object
const passwordValidator = {
  forgotPassword,
  getResetToken,
};


// export the object
module.exports = passwordValidator;
