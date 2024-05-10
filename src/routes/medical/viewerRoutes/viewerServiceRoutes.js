var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../../configs/auth0CheckJwt");
const authErrorHandler = require("../../../utils/authErrorHandlerUtil");
const viewerService = require("../../../services/medical/view/viewerService")
const {viewerSearchValidator, viewerCreationValidator} = require("../../../validation/viewerRequestsValidator");

const VIEWER_ROOT_PATH = process.env.API_VIEWER_ROOT_PATH
const VIEWER_REQUEST_PATH = process.env.API_VIEWER_REQUEST_PATH;
const VIEWER_SEARCH_PATH = process.env.API_VIEWER_SEARCH_PATH;

router.use(auth0CheckJwt);

// search by email
router.get(VIEWER_SEARCH_PATH, viewerSearchValidator, async function(req, res) {
    let result = await viewerService.searchForUserByEmail(req.query.email);
    return res.status(result.code).send(result);
});

// get all viewer Request
router.get(VIEWER_REQUEST_PATH, async function(req,res) {
    let result = await viewerService.getAllViewers(req);
    return res.status(result.code).send(result);
});

// create viewer request
router.post(VIEWER_REQUEST_PATH, viewerCreationValidator, async function(req, res) {
    let result = await viewerService.sendViewRequest(req);
    return res.status(result.code).send(result);
});

router.get(`${VIEWER_REQUEST_PATH}/:requestId`, async function(req, res) {
    let result = await viewerService.getViewerRequestById(req);
    return res.status(result.code).send(result);
});

router.post(`${VIEWER_REQUEST_PATH}/:requestId/accept`, async function(req, res) {

});


router.get(`${VIEWER_REQUEST_PATH}/:requestId/consent`, async function(req, res) {

});
router.post(`${VIEWER_REQUEST_PATH}/:requestId/consent`, async function(req, res) {

});

router.get("/viewer", async function( req, res) {
    let result = await viewerService.getAllApprovedViewers(req);
    return res.status(result.code).send(result);
})

router.use(authErrorHandler)

module.exports = router;
