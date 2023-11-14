var express = require('express');
var router = express.Router();
const getDayToIndex = require("../../utils/getDayToIndex")
const medicineRoutineService = require("../../services/MedicineRoutineService")
const {request} = require("express");
const medicineRoutineDayService = require("./medicineRoutineDayService")
const {timeIntervalRequestValidator} = require("../../validation/newTimeIntervalRequestValidator")




router.get("/", function (req, res) {
    console.log(req.user.id)
    medicineRoutineService.getUserMedicineRoutine(req.user.id).then(result => {
        return res.status(result.success ? 200 : 400).send(result)
    })

})

router.post("/times",timeIntervalRequestValidator, function (request, response ){
    medicineRoutineService.addTimeIntervalToUser(request).then(result => {
        console.log(result)
        return response.status(result.success ? 200 : 400).send(result)
    })
})

router.put("/times", function (request, response ){
    return response.status(200).send({"msg": "okay"})
})

router.use("day/", medicineRoutineDayService)

// router.get(`/:date${regx}/:interval([1-9]|10)`, function (req, res) {
// return res.send(req.params.interval)
// })


module.exports = router;
