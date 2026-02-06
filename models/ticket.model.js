const mongoose = require("mongoose");
const constants= require("../utils/constant");

const ticketSchema = new mongoose.Schema({
    title:{type:String, required:true},
    ticketPriority:{type:Number, required:true, default:4},
    description:{type:String, required:true},
    status:{type:String,required:true, enum:[constants.ticketStatuses.open,constants.ticketStatuses.blocked,constants.ticketStatuses.closed], default:constants.ticketStatuses.open},
    reporter:{type:String, required:true},
    assignee:{type:String}

},{timestamps:true});


module.exports = mongoose.model("Ticket",ticketSchema);