var express = require('express');
var router = express.Router();


let regx = "(mon|tues|wed|thurs|fri|sat|sun|Mon|Tues|Wed|Thurs|Fri|Sat|Sun|Monday|monday|Tuesday|tuesday|Wednesday|wednesday|Thursday|thursday|Friday|friday|Saturday|saturday|Sunday|sunday|[1-7])"





router.get(`/:date${regx}`, function (req, res){

    return res.send(req.params.date);
})



module.exports = router;
