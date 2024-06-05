const express = require('express');
const router = express.Router();
const {newTimeIntervalValidators,deleteTimeIntervalValidators, updateTimeIntervalValidator} = require("../../../../validation/timeIntervalRequestValidator")
const timeIntervalService = require("../../../../services/medical/routines/TimeIntervalService")
const TIME_PATH = "/time";

// get time intervals
router.get(TIME_PATH, async function (req, res) {
    let result = await timeIntervalService.getTimeInterval(req);
    return res.status(result.code).send(result);
});

// ADD time interval
router.post(TIME_PATH, newTimeIntervalValidators, async function(req, res) {
    let result = await timeIntervalService.addTimeInterval(req);
    return res.status(result.code).send(result);
});

// Delete time intervals
router.delete(TIME_PATH, deleteTimeIntervalValidators, async function (req, res) {
    let result = await timeIntervalService.deleteTimeIntervals(req);
    return res.status(result.code).send(result);
});

// update time intervals
router.patch(TIME_PATH, updateTimeIntervalValidator, async function (req, res) {
    let result = await timeIntervalService.updateTimeIntervals(req);
    return res.status(result.code).send(result);
});

module.exports = router;
