// errorHandler.js

  exports.errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack); // Log the stack trace for debugging
    res.status(500).send({
        error: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null, // Optional for security
    });
};
