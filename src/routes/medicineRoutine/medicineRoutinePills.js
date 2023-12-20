var express = require('express');
var router = express.Router();
const MedicineRoutinePillService = require("../../services/MedicineRoutinePillService");


router.post("", function (req, res){
    MedicineRoutinePillService.addPillFromRoutine(req).then(result => {
        return res.status(result.code).send(result)
    })
})

router.delete("", function (req, res) {
    MedicineRoutinePillService.removePillFromRoutine(req).then(result => {
        return res.status(result.code).send(result)
    })
})


module.exports = router;
