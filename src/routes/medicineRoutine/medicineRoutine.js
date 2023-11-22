var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../../services/MedicineRoutineService")
const medicineRoutineDay = require("./medicineRoutineDay")
const medicineRoutineTime = require("./medicineRoutineTimes")




router.get("/", function (req, res) {
    console.log(req.user.id)
    medicineRoutineService.getUserMedicineRoutine(req.user.id).then(result => {
        return res.status(result.success ? 200 : 400).send(result)
    })

})

router.use("/times",medicineRoutineTime )
router.use("/day", medicineRoutineDay)


module.exports = router;
