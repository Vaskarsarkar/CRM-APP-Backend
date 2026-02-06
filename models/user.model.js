const mongoose = require("mongoose");
const constants= require("../utils/constant");

const userSchema =new mongoose.Schema({
    name:{type:String, required:true},
    userId:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    email:{type:String, required:true, unique:true,lowercase:true},
    userType:{type:String, enum:[constants.userTypes.admin, constants.userTypes.customer, constants.userTypes.engineer],required:true, default:constants.userTypes.customer},
    userStatus:{type:String,enum:[constants.userStatuses.approved, constants.userStatuses.pending, constants.userStatuses.blocked],required:true,default:constants.userStatuses.approved}
},{timestamps:true});

module.exports = mongoose.model("User",userSchema);
