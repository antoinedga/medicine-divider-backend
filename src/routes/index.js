var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../services/MedicineRoutineService");
const viewerService = require("../services/viewerService")
/* GET home page. */
router.get('/', function(req, res, next) {
  viewerService.searchForUserByEmail("a").then(response => {
    return res.status(200).send(response)
  })
});

module.exports = router;
