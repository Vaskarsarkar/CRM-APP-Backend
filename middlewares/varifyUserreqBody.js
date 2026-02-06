const User = require('../models/user.model');
const constants = require("../utils/constant");

validateUserReqBody = async(req, res, next) => {


    if(!req.body.name){
        return res.status(400).json({message:"Name is required"});
    }


    if(!req.body.userId){
        return res.status(400).json({message:"userId is required"});
    }

    const user = await User.findOne({userId:req.body.userId});
    if(user){
        return res.status(400).json({message:"userId already exists"});
    }


    if(!req.body.email){
        return res.status(400).json({message:"email is required"});
    }

    const email= await User.findOne({email:req.body.email});
    if(email){
        return res.status(400).json({message:"email already exists"});
    }

    const possibleUserTypes = [constants.userTypes.admin, constants.userTypes.customer, constants.userTypes.engineer];
    if(req.body.userType && !possibleUserTypes.includes(req.body.userType)){
        return res.status(400).json({message:`userType must be one of the following: ${possibleUserTypes.join(", ")}`});
    }

    if(!req.body.password){
        return res.status(400).json({message:"password is required"});
    }


    next();
}



const validateUserStatusAndUserType = (req,res,next) => {
    //validate userType
    const userType = req.body.userType;
    const possibleUserTypes = [constants.userTypes.admin, constants.userTypes.customer, constants.userTypes.engineer];

    if(userType && !possibleUserTypes.includes(userType)){
        return res.status(400).json({message:`User Type is invalid. userType must be one of the following: ${possibleUserTypes.join(", ")}`});
    }


    //validate userStatus
    const userStatus = req.body.userStatus;
    const possibleUserStatuses = [constants.userStatuses.approved, constants.userStatuses.pending, constants.userStatuses.blocked];

    if(userStatus && !possibleUserStatuses.includes(userStatus)){
        return res.status(400).json({message:`User Status is invalid. userStatus must be one of the following: ${possibleUserStatuses.join(", ")}`});
    }

    next();
}

module.exports ={
    validateuserReqBody: validateUserReqBody,
    validateUserStatusAndUserType: validateUserStatusAndUserType

}