var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../../services/medicine/MedicineRoutineService")
const auth0CheckJwt = require("../../configs/auth0CheckJwt")
const addPillValidator = require("../../validation/addPillValidator")
const authErrorHandler = require("../../utils/authErrorHandlerUtil");
const API_PATH = "/medicine";
router.get(API_PATH, auth0CheckJwt, async function (req, res) {
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await medicineRoutineService.getUserMedicineRoutine(userId);
    return res.status(result.success ? 200 : 400).send(result)

});

router.post(API_PATH, auth0CheckJwt, addPillValidator, async function(req, res) {
    return res.send()
});

router.use(authErrorHandler)

module.exports = router;
