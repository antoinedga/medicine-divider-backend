var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../../../../configs/auth0CheckJwt");
const authErrorHandler = require("../../../../../utils/authErrorHandlerUtil");
const viewRequestService = require("../../../../../services/medical/view/viewer/request/viewRequestService");

const {viewerSearchValidator, viewerCreationValidator
    , viewerRequestIdValidator} = require("../../../../../validation/viewerRequestsValidator");

const VIEWER_REQUEST_PATH = process.env.API_VIEWER_REQUEST_PATH;
const VIEWER_SEARCH_PATH = process.env.API_VIEWER_SEARCH_PATH;

// search by email
router.get(VIEWER_SEARCH_PATH, viewerSearchValidator, async function(req, res) {
    let result = await viewRequestService.searchForUserByEmail(req);
    return res.status(result.code).send(result);
});

// get Pending viewer Requests
router.get(VIEWER_REQUEST_PATH, async function(req,res) {
    let result = await viewRequestService.getPendingRequests(req, false);
    return res.status(result.code).send(result);
});

// create viewer request
router.post(VIEWER_REQUEST_PATH, viewerCreationValidator, async function(req, res) {
    let result = await viewRequestService.sendRequest(req);
    return res.status(result.code).send(result);
});

// get request
router.get(`${VIEWER_REQUEST_PATH}/:requestId`,viewerRequestIdValidator, async function(req, res) {
    let result = await viewRequestService.getViewerRequestById(req);
    return res.status(result.code).send(result);
});
// accept request
router.post(`${VIEWER_REQUEST_PATH}/:requestId/accept`, viewerRequestIdValidator, async function(req, res) {
    let result = await viewRequestService.acceptViewerRequest(req);
    return res.status(result.code).send(result);
});

router.post(`${VIEWER_REQUEST_PATH}/:requestId/cancel`,viewerRequestIdValidator, async function(req, res) {
    let result = await viewRequestService.cancelRequestToBeSender(req);
    return res.status(result.code).send(result);
});

router.post(`${VIEWER_REQUEST_PATH}/:requestId/reject`, viewerRequestIdValidator, async function(req, res) {
    let result = await viewRequestService.rejectViewerRequest(req);
    return res.status(result.code).send(result);
});

module.exports = router;
