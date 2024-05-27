var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../../../configs/auth0CheckJwt");
const authErrorHandler = require("../../../../utils/authErrorHandlerUtil");
const viewerService = require("../../../../services/medical/view/viewer/viewerService");

const VIEWER_ROOT_PATH = process.env.API_VIEWER_PATH

router.use(auth0CheckJwt);

router.get(`${VIEWER_ROOT_PATH}`, async function (req, res) {
    let result = await viewerService.getListOfViewers(req);
    return res.status(result.code).send(result);
})
router.delete(`${VIEWER_ROOT_PATH}`, async function(req, res) {
    let result = await viewerService.removeFromViewer(req);
    return res.status(result.code).send(result);
})
router.use(authErrorHandler)

module.exports = router;