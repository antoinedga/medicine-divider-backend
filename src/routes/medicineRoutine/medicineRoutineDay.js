var express = require('express');
var router = express.Router();
const MedicineDividerUserSchema = require("../../models/medicineDividerUser")
const MedicineRoutineDayService = require("../../services/MedicineRoutineDayService")

let regx = "(mon|tues|wed|thurs|fri|sat|sun|Mon|Tues|Wed|Thurs|Fri|Sat|Sun|Monday|monday|Tuesday|tuesday|Wednesday|wednesday|Thursday|thursday|Friday|friday|Saturday|saturday|Sunday|sunday|[1-7])"


router.get(`/:day${regx}`, function (req, res){
    MedicineRoutineDayService.getRoutineByDay(req).then(result => {
        return res.status(result.code).send(result)
    })
})



module.exports = router;
