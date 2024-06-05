const express = require('express');
const router = express.Router();
const medicineRoutineService = require("../../../services/medical/routines/MedicineRoutineService")
// get all

router.get("", async function (req, res) {
    let result = await medicineRoutineService.getUserMedicineRoutine(req);
    return res.status(result.code).send(result)
});
router.get("/days/:day", async function(req,res) {
    let result = await medicineRoutineService.getUserMedicineRoutineByDay(req, req.params.day);
    return res.status(result.code).send(result)
});

module.exports = router;
