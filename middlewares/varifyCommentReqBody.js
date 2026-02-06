const Ticket = require("../models/ticket.model");


const validateCommentRequestBody = async (req,res,next) => {

    //validate if ticketId is present in the request body
    if(!req.params.ticketId){
        return res.status(400).json({message:"ticketId is required in the request parameters"});
    }

    //need to check if it is a valid ticket
    const ticket = await Ticket.findOne({_id: req.params.ticketId});
    if(!ticket){
        return res.status(400).json({
            message:"Invalid ticketId. Ticket does not exist"
        });
    }

    //validate if content is present in the request body
    if(!req.body.content){
        return res.status(400).json({
            message:"Content is required in the request body"
        });
    }

    next();

}


//validate  ticketId 

const validateTicketId = async (req,res,next) => {

    //need to check if it is a valid ticket
    const ticket = await Ticket.findOne({_id: req.params.ticketId});
    if(!ticket){
        return res.status(400).json({
            message:"Invalid ticketId. Ticket does not exist"
        });
    }

    next();

}


module.exports = {
    validateCommentRequestBody: validateCommentRequestBody,
    validateTicketId: validateTicketId
}