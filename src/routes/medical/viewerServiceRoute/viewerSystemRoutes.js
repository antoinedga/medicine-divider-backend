var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../../configs/auth0CheckJwt");
const authErrorHandler = require("../../../utils/authErrorHandlerUtil");

const VIEWER_PATH = "/viewer/requests";
const CONSENT_MESSAGE = require("../../../utils/consentMessageUtil")

router.get(VIEWER_PATH, async function(req,res) {

});

router.post(VIEWER_PATH, async function(req, res) {

});

router.get(`${VIEWER_PATH}/:requestId`, async function(req, res) {
    const requestId = req.params.requestId;

});

router.post(`${VIEWER_PATH}/:requestId/accept`, async function(req, res) {

});
router.get(`${VIEWER_PATH}/:requestId/consent`, async function(req, res) {

});
router.patch(`${VIEWER_PATH}/:requestId/consent`, async function(req, res) {

});

router.use(authErrorHandler)

module.exports = router;
