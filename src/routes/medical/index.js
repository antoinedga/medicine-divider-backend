var express = require('express');
var router = express.Router();
const medicineRoutineService = require("./routineRoutes/medicineRoutine");
const pillsRoutes = require("./routineRoutes/pills/pillsRoutes")
const timeIntervalRoutes = require("./routineRoutes/time/timeIntervalRoutes");
const viewerRoutes = require("./viewRoutes/viewerRoutes/viewerRoutes")
const viewerRequestRoutes = require("./viewRoutes/viewerRoutes/viewerRequestRoutes/viewerRequestServiceRoutes")
const viewingRoutes =  require("./viewRoutes/viewingRoutes/viewingServiceRoutes")
const userRoutes = require("../usersRoutes")
const auth0CheckJwt = require("../../configs/auth0CheckJwt");
const authErrorHandler = require("../../utils/authErrorHandlerUtil");

const API_VERSION_PATH = process.env.API_VERSION_PATH
const API_ROUTINE_PATH = process.env.API_ROUTINE_PATH;

const API_VIEW_PATH = process.env.API_VIEW_PATH

router.use((req, res, next) => {
    if (req.path.startsWith('/auth')) {
        // Skip checkToken middleware for user routes
        return next();
    }
    console.log("calling auth0 check jwt")
    auth0CheckJwt(req, res, next);
});

router.use(userRoutes);
router.use(API_VERSION_PATH + API_ROUTINE_PATH, timeIntervalRoutes);
router.use(API_VERSION_PATH + API_ROUTINE_PATH, medicineRoutineService); // route of /medical/routine
router.use(API_VERSION_PATH + API_ROUTINE_PATH, pillsRoutes);

router.use(API_VERSION_PATH + API_VIEW_PATH, viewerRoutes);

router.use(API_VERSION_PATH + API_VIEW_PATH, viewerRequestRoutes);
router.use(API_VERSION_PATH + API_VIEW_PATH, viewingRoutes)

router.use(authErrorHandler)

module.exports = router;
