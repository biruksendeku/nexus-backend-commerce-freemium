

// import packages
const nodemailer = require('nodemailer');


// configure nodemailer to include our credentials
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// export the configured transporter
module.exports = transporter;
