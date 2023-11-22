var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../../services/MedicineRoutineService");
const timeIntervalRequestValidator = require("../../validation/timeIntervalRequestValidator")

router.post("",timeIntervalRequestValidator.newTimeIntervalValidators, function (request, response ){
    medicineRoutineService.addTimeIntervalToUser(request).then(result => {
        console.log("result " + result)
        return response.status(result.code).send(result)
    })
})

router.delete("", timeIntervalRequestValidator.removalTimeIntervalValidators, function(request, response) {
    medicineRoutineService.deleteTimeInterval(request).then(result => {
        return response.status(result.code).send(result)
    })
})


module.exports = router;
