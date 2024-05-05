var express = require('express');
var router = express.Router();
const medicineRoutineService = require("./routineRoutes/medicineRoutine");
const pillsRoutes = require("./routineRoutes/pills/pillsRoutes")
const timeIntervalRoutes = require("./routineRoutes/time/timeIntervalRoutes");
const viewerSystemRoutes = require("./viewerServiceRoute/viewerSystemRoutes")
const userRoutes = require("../usersRoutes")

const API_VERSION_PATH = "/api/v1/medical"
const API_ROUTINE_PATH = "/routine";
const API_VIEWER_PATH = "/viewer";
function handleAuthError(err, req, res, next) {
    // If authentication error (token expired, invalid token, etc.)
    if (err.name === 'UnauthorizedError' || err.name === 'InvalidTokenError') {
        // Customize the response here
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // For other errors, pass them to the default error handler
    next(err);
}

router.use(handleAuthError);

router.use(userRoutes);
router.use(API_VERSION_PATH + API_ROUTINE_PATH, timeIntervalRoutes);
router.use(API_VERSION_PATH + API_ROUTINE_PATH, medicineRoutineService); // route of /medical/routine
router.use(API_VERSION_PATH + API_ROUTINE_PATH, pillsRoutes);
router.use(API_VERSION_PATH + API_VIEWER_PATH, viewerSystemRoutes);

module.exports = router;
