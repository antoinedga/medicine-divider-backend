var express = require('express');
const auth0CheckJwt = require("../../../../configs/auth0CheckJwt");
const addPillValidator = require("../../../../validation/addPillValidator");
const {allOccurrenceValidator, onCertainDaysValidator} = require("../../../../validation/deletePillValidator")
const pillsService = require("../../../../services/medical/routines/PillsService");
const authErrorHandler = require("../../../../utils/authErrorHandlerUtil");
const {request} = require("express");
const router = express.Router();

const PILL_PATH = "/pills"
router.post(PILL_PATH, auth0CheckJwt, addPillValidator, async function(req, res) {
    let result = await pillsService.addPillToRoutine(req);
    return res.status(result.code).send(result);
});

// Delete All Occurrence
router.delete(PILL_PATH, auth0CheckJwt, allOccurrenceValidator, async function(req, res) {
    let result = await pillsService.deletePillFromRoutineByAllOccurrence(req);
    return res.status(result.code).send(result);
});

// Delete By Days
router.delete(PILL_PATH + "/bydays", auth0CheckJwt, onCertainDaysValidator, async function(req, res) {

    let result = await pillsService.deletePillFromRoutineByDays(req);
    return res.status(result.code).send(result);
});

router.delete(PILL_PATH + "/bydaytime", auth0CheckJwt, onCertainDaysValidator, async function(req, res) {

    let result = await pillsService.deletePillFromRoutineByDayTime(req);
    return res.status(result.code).send(result);
});

router.get(PILL_PATH + "/names", auth0CheckJwt, async function (req, res) {
    let result = await pillsService.getAllPillsInRoutine(req);
    return res.status(result.code).send(result);
});


router.use(authErrorHandler)

module.exports = router;