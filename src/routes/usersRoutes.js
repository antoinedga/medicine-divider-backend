const express = require('express');
const app = require("../../app")
const router = express.Router();
const userService = require('../services/userService')
const {authenticationClient} = require("../configs/auth0client")
const {request} = require("express");

router.post("/register", async (req, res) => {
    let result = await userService.createUser(req);
    res.send(result)
})

router.post('/auth/callback', express.urlencoded({ extended: false }), (req, res) =>
    res.oidc.callback({
        redirectUri: 'http://localhost:3000/callback',
    })
);
router.get("/auth/callback", async (req, res) => {
    const accessToken = req.oidc.accessToken;
    const idToken = req.oidc.idToken;
    res.body({idToken, accessToken}).send();
})

module.exports = router;
