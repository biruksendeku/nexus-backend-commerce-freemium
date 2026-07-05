

// import packages
const { AppError } = require('./customErrors');


// define error handler
const errorHandler = (err, req, res, next) => {

	// you could also save errors on db for to track them more efficiently

    // handle abort error
    if(err.name === 'AbortError') return;

    // handle MongoDB duplicate-key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate value error'
        });
    }

    // handle validation error from express-validator
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // our custom errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // handling unknown error
    console.error('Error message: ', err.message);
    console.error(err);
    
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
};



module.exports = { errorHandler };
