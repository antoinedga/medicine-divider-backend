// Define a custom error handler middleware for authentication errors
const LOGGER = require("../configs/loggerWinston")
function handleAuthError(err, req, res, next) {
    // If authentication error (token expired, invalid token, etc.)
    if (err.name === "InvalidTokenError" || err.name === "UnauthorizedError") {
        LOGGER.error(req, err.message)
        LOGGER.debug(req, err.stack)

        console.error(`${err.name}: ${err.stack}`)
        return res.status(401).json({error: 'Unauthorized: Invalid Token'})
    }
    // For other errors, pass them to the default error handler
    next(err);
}

module.exports = handleAuthError;