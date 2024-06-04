const express = require('express');
const router = express.Router();
const medicineRoutineService = require("../../../services/medical/routines/MedicineRoutineService")
// get all

router.get("", async function (req, res) {
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await medicineRoutineService.getUserMedicineRoutine(req, userId);
    return res.status(result.code).send(result)
});
router.get("/days/:day", async function(req,res) {
    const decodedToken = req.auth;
    // Extract user ID from the decoded JWT token's payload
    const userId = decodedToken.payload.sub;
    let result = await medicineRoutineService.getUserMedicineRoutineByDay(req, userId, req.params.day);
    return res.status(result.code).send(result)
});

module.exports = router;
