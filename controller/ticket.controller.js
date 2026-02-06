const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../utils/constant");


const {randomUUID: uuidv4} = require("crypto"); 
const {createRedis} = require("../utils/redisClient");
const redisClient = createRedis();

const dotenv = require("dotenv");
dotenv.config();

const QUEUE_KEY = process.env.QUEUE_KEY || "queue:notifications";

//controller to create ticket
//As soon as ticket is created it should be assigned to an engineer
const sentMessageToRedis = async(req,engineer,ticket) =>{
    //we need send the message to the queue 

            /**
             * 1. Locator or the endpoint for fetching the new ticket
             * 2. Need to send a list of email ids : a.User b. Assigned engineer
             */
            
    const emailLists = [];

    try {
        const user = await User.findById(req.userId);
        if (user) emailLists.push(user.email);
    } catch (err) {
        console.log("Error fetching user", err.message);
    }

    if (engineer) {
        emailLists.push(engineer.email);
    }

    // create the message that needs to be sent to the Redis queue

    const ticketLink = process.env.BASE_URL || "http://localhost:8080";
    const message = {
        emails: [...emailLists],
        ticketLink: `${ticketLink}/crm/api/v1/tickets/${ticket._id}`,
    };

    try {
        await enqueue(message);
        console.log("Message passed to Redis");
    } catch (err) {
        console.log("Redis enqueue failed", err.message);
    }

}


exports.createTicket = async (req, res) => {
    //read the ticket details from req body
    const ticketObj = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description,
        status: constants.ticketStatuses.open,
        reporter: req.userId
    };


    //create the ticket - assign to an engineer if available

    // find an approved engineer 
    const engineer = await User.findOne({
        userType:constants.userTypes.engineer, 
        userStatus:constants.userStatuses.approved
    });

    if(engineer){
        ticketObj.assignee = engineer.userId;
    }

    try{
        const ticket = await Ticket.create(ticketObj);
        console.log(ticket)
        if(ticket){
            await sentMessageToRedis(req,engineer,ticket);

            console.log(ticket)
            return res.status(201).send(ticket);
        }return

    }catch(err){
        console.log("Error while creating ticket", err);
        return res.status(500).json({message:"Internal server error while creating ticket"});
    }
}





// //controller to update ticket details
exports.updateTicket = async (req, res) => {
    const ticket = Ticket.findOne({ _id: req.params.ticketId });

    //which user is making the call
    const callingUserDetails = await User.findOne({ userId: req.userId });

    //check if ticket exists
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    //check if right user is trying to update the ticket
    if(ticket.reporter == req.userId && callingUserDetails.userType == constants.userTypes.admin || callingUserDetails.userType == constants.userTypes.engineer){
        //allowed to update
        // ticket.title = req.body.title || ticket.title;
        // ticket.description = req.body.description || ticket.description;
        // ticket.ticketPriority = req.body.ticketPriority || ticket.ticketPriority;
        // ticket.status = req.body.status || ticket.status;

        ticket.title = req.body.title !== undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description !== undefined ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority !== undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status !== undefined ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee !== undefined ? req.body.assignee : ticket.assignee;
    
        const updatedTicket= await ticket.save();

        // I need to send the notification to both the user and the engineer about the update in ticket details

        try {
            const engineer = await User.findById(updatedTicket.assignee);
            await sentMessageToRedis(req,engineer,updatedTicket);
        } catch (err) {
            console.log("Error fetching engineer", err.message);
        }

        return res.status(200).json(updatedTicket);
    
    } else {
    
        return res.status(403).json({ message: "Not authorized to update ticket" });
    }

    //only admin or assigned engineer should be able to update the ticket
    if (
        callingUserDetails.userType != constants.userTypes.admin &&
        req.userId != ticket.assignee
    ) {
        return res.status(403).json({ message: "Not authorized to update ticket" });
    }
};


/**
 * Fetching all the tickets :
 * 1. Customers should be able to see only the tickets created by them
 * 2. Engineers should be able to see only the tickets assigned to them
 * 3. Admin should be able to see all tickets
 */

exports.getAllTickets = async (req, res) => {

    const queryObj = {};

    //Fetching the details of the user making the call
    const savedUser = await User.findById(req.userId);

    if (!savedUser) {
        return res.status(401).json({ message: "Invalid user" });
    }   
    console.log("Saved User:", savedUser);


    if (savedUser.userType == constants.userTypes.customer) {
        //fetch only tickets created by this customer
        queryObj.reporter = savedUser._id;
       
    } else if (savedUser.userType == constants.userTypes.engineer) {
        //fetch only tickets assigned to this engineer
        queryObj.assignee = savedUser._id;
       
    } else {
        //admin : fetch all tickets
        
    }
    const tickets = await Ticket.find(queryObj);
    console.log("Tickets:", tickets);
    return res.status(200).json(tickets);
};


//Fetch ticket by ticketId
exports.getTicketById = async (req, res) => {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }

    const savedUser = await User.findById(req.userId);
    if(savedUser.userType == constants.userTypes.admin || ticket.reporter == req.userId || ticket.assignee == req.userId){

        return res.status(200).json(ticket);
    }else{
        return res.status(403).json({ message: "Not authorized to view this ticket" });
    }
};



const enqueue =async (payload) => {
    const msg = JSON.stringify({
        id: uuidv4(),
        ts:new Date().toISOString(),
        ...payload
    });

    const len = await redisClient.rpush(QUEUE_KEY, msg);
    console.log(`[Producer] Enqueued -> ${msg} Queue length : ${len}`);
}
