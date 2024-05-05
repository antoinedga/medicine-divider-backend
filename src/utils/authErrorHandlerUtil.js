// Define a custom error handler middleware for authentication errors
function handleAuthError(err, req, res, next) {
    // If authentication error (token expired, invalid token, etc.)
    console.log(req.auth)
    if (err.name === "InvalidTokenError") {
        return res.status(401).json({error: 'Unauthorized: Invalid Token'})
    }
    // For other errors, pass them to the default error handler
    next(err);
}

module.exports = handleAuthError;