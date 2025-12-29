const errorHandler = (err, req, res, next) => {
let statusCode = err.statusCode || 500;
let message = err.message || 'Internal Server Error';

res.status(statusCode).json({ message });


//mangoose validation error
if(err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Validation error: ${errors.join('. ')}`;
}

//mangoose bad ObjectId
if(err.name === 'BSONTypeError') {
    statusCode = 400;
    message = `Resource not found. Invalid ID`;
}

//mongoose duplicate key error
if(err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate field value entered for ${field}`;
}

//Mangoose cast error
if(err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
}

//mangoose authentication error
if(err.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'Authentication failed';
}

//multiple error types handling
if(err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large';
}

//JWT errors
if(err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
}

if(err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
}

console.error(' Error:', {
    message: err.message,
    statusCode,
    stack: process.env.NODE_ENV === 'development' && { stack: err.stack }
});


res.status(statusCode).json({ 
    success: false,
    error: message,
    statusCode,
    ...((process.env.NODE_ENV === 'development' && { stack: err.stack })) 
});
};
export default errorHandler;
