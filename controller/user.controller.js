// this is controller for supporting user related APIs
const objectConverter = require("../utils/objectConverter")
const User = require("../models/user.model");


//controller to fetch all the user

exports.findAll =async (req,res)=>{
    // start supporting the query params 

    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus;

    const queryObj = {};

    if(userTypeReq){
        queryObj.userType = userTypeReq;
    }

    if(userStatusReq){
        queryObj.userStatus = userStatusReq;
    }

    console.log(queryObj);


    const users = await User.find(queryObj);


    console.log(users);
    console.log(objectConverter.userResponse(users));

    return res.status(200).json(objectConverter.userResponse(users));
}



//controller to fetch user by userId
exports.findByUserId = async (req,res)=>{
    const userId = req.params.userId;

    const user = await User.find({userId:userId});

    if(user && user.length >0){
        return res.status(200).json(objectConverter.userResponse(user));
    }else {
        return res.status(404).json({message:`User with userId: ${userId} not found`});
    }
}



//controller to update user and its details
exports.updateUser = async (req,res)=>{
    const userIdReq = req.params.userId;

    try{
        const user =await User.findOneAndUpdate({userId:userIdReq},{
            userName:req.body.name,
            userType:req.body.userType,
            userStatus:req.body.userStatus
        }).exec();

        res.status(200).send({
            message:"User details updated successfully"
        });
        
    }catch(err){
        console.log("Error while updating user details",err);
        res.status(500).send({  
            message:"Some internal error while updating user details"
        });
    }
}