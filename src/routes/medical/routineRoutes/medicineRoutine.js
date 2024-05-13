var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../../../services/medical/routines/MedicineRoutineService")
const auth0CheckJwt = require("../../../configs/auth0CheckJwt")
const authErrorHandler = require("../../../utils/authErrorHandlerUtil");
// get all

router.use(auth0CheckJwt);
router.use(authErrorHandler);

router.get("", async function (req, res) {
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await medicineRoutineService.getUserMedicineRoutine(userId);
    return res.status(result.success ? 200 : 400).send(result)

});

module.exports = router;
