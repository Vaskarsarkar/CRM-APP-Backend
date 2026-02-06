const express = require("express");
const route = express.Router();
const ticketController = require("../controller/ticket.controller");
const commentController = require("../controller/comment.controller");
const awthMW = require("../middlewares/authjwt");
const varifyTicketReqBody = require("../middlewares/varifyTicketRequestBody");
const commentMW = require("../middlewares/varifyCommentReqBody");


route.post("/tickets",[awthMW.verifyToken,varifyTicketReqBody.validateTicketReqBody], ticketController.createTicket);
route.put("/tickets/:ticketId",[ awthMW.verifyToken,varifyTicketReqBody.validateTicketStatus], ticketController.updateTicket);
route.get("/tickets",[awthMW.verifyToken], ticketController.getAllTickets);
route.get("/tickets/:ticketId",[awthMW.verifyToken], ticketController.getTicketById);

//comments related routes
route.post("/tickets/:ticketId/comments",[awthMW.verifyToken,commentMW.validateCommentRequestBody], commentController.createComment);
route.get("/tickets/:ticketId/comments",[awthMW.verifyToken,commentMW.validateTicketId], commentController.fetchComments);

module.exports = route;