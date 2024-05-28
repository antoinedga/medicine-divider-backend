var express = require('express');
var router = express.Router();
const auth0CheckJwt = require("../../../../configs/auth0CheckJwt");
const authErrorHandler = require("../../../../utils/authErrorHandlerUtil");
const viewingService = require("../../../../services/medical/view/viewing/viewingService")

const VIEWING_ROOT_API = process.env.API_VIEWING_PATH
router.get(VIEWING_ROOT_API, async function(req, res){
   let result = await viewingService.getListOfUserCanView(req);
   return res.status(result.code).send(result);
});

module.exports = router;
