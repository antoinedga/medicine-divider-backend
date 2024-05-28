const express = require('express');
const router = express.Router();
const userService = require('../services/userService')


router.post('/auth/post-registration', express.urlencoded({ extended: false }), async (req, res) => {
    console.log("received call from auth0: " + JSON.stringify(req.body))
    let result = await userService.createUser(req);
    return res.status(result.code).send(result);
});

module.exports = router;
