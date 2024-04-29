var express = require('express');
var router = express.Router();
const medicineRoutineService = require("./medicineRoutine/medicineRoutine");
const timeIntervalRoutes = require("./TimeInterval/TimeIntervalRoutes");
const userRoutes = require("./usersRoutes")

const API_VERSION_PATH = "/api/v1"


function handleAuthError(err, req, res, next) {
    // If authentication error (token expired, invalid token, etc.)
    if (err.name === 'UnauthorizedError' || err.name === 'InvalidTokenError') {
        // Customize the response here
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // For other errors, pass them to the default error handler
    next(err);
}

router.use(handleAuthError)

router.use(userRoutes);
router.use(API_VERSION_PATH, timeIntervalRoutes);
router.use(API_VERSION_PATH, medicineRoutineService)

module.exports = router;
