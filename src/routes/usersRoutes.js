const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.post("/api/auth/post-registration", async (req, res) => {
  console.log("received call from auth0: " + JSON.stringify(req.body));
  let result = await userService.createUserAndSaveInDB(req);
  return res.status(result.code).send(result);
});

module.exports = router;
