var express = require('express');
var router = express.Router();
const medicineRoutineService = require("../services/MedicineRoutineService");
const viewerService = require("../services/viewerService")
const addPillValidator = require("../validation/addPillValidator")
/* GET home page. */
router.get('/', function(req, res, next) {
  viewerService.searchForUserByEmail("a").then(response => {
    return res.status(200).send(response)
  })
});

router.post("/test",addPillValidator, function(req, res) {
  return res.send("success")
} )

module.exports = router;
