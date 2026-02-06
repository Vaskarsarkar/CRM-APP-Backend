const constants = require("../utils/constant");

const validateTicketReqBody=(req,res,next)=>{
    // validate title
    if(!req.body.title){
        return res.status(400).json({message:"Title is required"});
    }

    if(!req.body.description){
        return res.status(400).json({message:"Description is required"});
    }

    next();
}

const validateTicketStatus=(req,res,next)=>{
    const status = req.body.status;

    const possibleStatuses = [constants.ticketStatuses.open, constants.ticketStatuses.blocked, constants.ticketStatuses.closed];
    if(status && !possibleStatuses.includes(status)){
        return res.status(400).json({message:`Status is invalid. Status must be one of the following: ${possibleStatuses.join(", ")}`});
    }

    next();
}


module.exports={
    validateTicketReqBody:validateTicketReqBody,
    validateTicketStatus:validateTicketStatus
};