const express = require("express");
const route = express.Router();
const userController = require("../controller/user.controller")
const awthMW = require("../middlewares/authjwt");
const varifyUserReqBody = require("../middlewares/varifyUserreqBody");

route.get("/users",[awthMW.verifyToken,awthMW.isAdmin],userController.findAll);

route.get("/users/:userId",[awthMW.verifyToken,awthMW.isAdmin],userController.findByUserId);

route.put("/users/:userId",[awthMW.verifyToken,awthMW.isAdmin,varifyUserReqBody.validateUserStatusAndUserType],userController.updateUser);



module.exports =route;