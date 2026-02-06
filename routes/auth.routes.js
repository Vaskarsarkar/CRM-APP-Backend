const express = require("express");
const route = express.Router();
const authController = require("../controller/auth.controller")
const validateuserreqBody = require("../middlewares/varifyUserreqBody");

route.post("/auth/signup",[validateuserreqBody.validateuserReqBody],authController.signUp);
route.post("/auth/signin",authController.signIn);



module.exports=route;