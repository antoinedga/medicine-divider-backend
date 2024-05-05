var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../../../services/medical/routines/MedicineRoutineService")
const auth0CheckJwt = require("../../../configs/auth0CheckJwt")
const addPillValidator = require("../../../validation/addPillValidator")
const authErrorHandler = require("../../../utils/authErrorHandlerUtil");
// get all
router.get("", auth0CheckJwt, async function (req, res) {
    console.log("got here")
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await medicineRoutineService.getUserMedicineRoutine(userId);
    return res.status(result.success ? 200 : 400).send(result)

});
// add pills
router.post("/pills", auth0CheckJwt, addPillValidator, async function(req, res) {
    let result = await medicineRoutineService.addPillToRoutine(req);
    return res.status(result.code).send(result)
});


router.use(authErrorHandler)

module.exports = router;
