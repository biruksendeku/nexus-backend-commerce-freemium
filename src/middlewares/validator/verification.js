

// import packages
const { param, body } = require('express-validator');
const User = require('../../models/user');


// for resendVerification route
const resendVerification = [
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
];



// for verifyEmail route
const verifyEmail = [
  param('token')
    .notEmpty()
    .withMessage('Token is required'),
];



// wrap in one object
const verificationValidator = {
  resendVerification,
  verifyEmail,
};


// export the object
module.exports = verificationValidator;
