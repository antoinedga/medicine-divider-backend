const express = require('express');
const router = express.Router();
const viewingService = require("../../../../services/medical/view/viewing/viewingService")
const {viewingEmailParamValidator} = require("../../../../validation/viewingRequestsValidator")
const VIEWING_ROOT_API = process.env.API_VIEWING_PATH
router.get(VIEWING_ROOT_API, async function(req, res){
   let result = await viewingService.getListOfUserCanView(req);
   return res.status(result.code).send(result);
});

router.get(VIEWING_ROOT_API + "/:email", viewingEmailParamValidator, async function(req, res) {
   let result = await viewingService.getMedicalRecordOfUser(req);
   return res.status(result.code).send(result);
});

router.delete(VIEWING_ROOT_API + "/:email", viewingEmailParamValidator, async function(req, res) {
   let result = await viewingService.removeSelfFromUsersViewerList(req);
   return res.status(result.code).send(result);
});

module.exports = router;
