var express = require('express');
var router = express.Router();
const MedicineDividerUserSchema = require("../../models/medicineDividerUser")
const MedicineRoutineDayService = require("../../services/MedicineRoutineDayService")
const {dayNameRegx} = require("../../utils/dayNameUtil")
let regx = dayNameRegx

router.get(`/:day${regx}`, function (req, res){
    MedicineRoutineDayService.getRoutineByDay(req).then(result => {
        return res.status(result.code).send(result)
    })
})



module.exports = router;
