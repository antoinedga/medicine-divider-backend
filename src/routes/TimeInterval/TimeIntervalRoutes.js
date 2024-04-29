var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../configs/auth0CheckJwt")
const {newTimeIntervalValidators} = require("../../validation/timeIntervalRequestValidator")
const timeIntervalService = require("../../services/TimeIntervalService")
const authErrorHandler = require("../../utils/authErrorHandlerUtil")
const TIME_PATH = "/time";

router.get(TIME_PATH, auth0CheckJwt, async function (req, res) {
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await timeIntervalService.getTimeInterval(userId);
    return res.status(result.code).send(result);
});

router.post(TIME_PATH, auth0CheckJwt, newTimeIntervalValidators, async function(req, res) {
    let result = await timeIntervalService.updateTimeInterval(req);
    return res.status(result.code).send(result);
});

router.delete(TIME_PATH, auth0CheckJwt, async function (req, res) {
    let result = await timeIntervalService.deleteTimeIntervals(req);
    return res.status(result.code).send(result);
});

router.use(authErrorHandler)

module.exports = router;