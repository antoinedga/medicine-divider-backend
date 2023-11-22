var express = require('express');
var router = express.Router();
const {createUserRequestValidator} = require('../validation/createUserRequestValidator')
const {loginRequestValidator} = require("../validation/loginRequestValidator");

const userService = require('../services/userService')
const {request, response} = require("express");
const {validationResult} = require("express-validator");

/* GET users listing. */


router.post('/register',createUserRequestValidator, async function (req, res, next) {
    userService.createUser(req, res).then(result => {
        return response.status(result.code).send(result);
    })
});

router.post("/login",loginRequestValidator, function (req, res) {
       userService.loginUser(req, res).then(result => {
           console.log(result)
        return result;
    })
});

module.exports = router;
