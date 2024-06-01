const express = require('express');
const router = express.Router();
const viewerService = require("../../../../services/medical/view/viewer/viewerService");

const VIEWER_ROOT_PATH = process.env.API_VIEWER_PATH

router.get(`${VIEWER_ROOT_PATH}`, async function (req, res) {
    let result = await viewerService.getListOfViewers(req);
    return res.status(result.code).send(result);
})
router.delete(`${VIEWER_ROOT_PATH}`, async function(req, res) {
    let result = await viewerService.removeFromViewer(req);
    return res.status(result.code).send(result);
})

module.exports = router;