

// import packages
const { body } = require('express-validator');


// for register route
const register = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password) // ← was equals()
    .withMessage('Password mismatch'),
];



// for login route
const login = [
  body('email')
    .notEmpty()
    .withMessage('Missing credentials')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Missing credentials'),
];



// wrap in one object
const authValidator = {
  register,
  login
};



// export the object
module.exports =  authValidator;
