
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const constants = require("../utils/constant");
const jwt = require("jsonwebtoken");
const config =require("../configs/auth.config")


//Logic to sign up -Customer(A) / Engineer(P) / Admin(P)

exports.signUp=async(req,res)=>{
    
    let userStatus = req.body.userStatus;
    if(!req.body.userType  || req.body.userType == constants.userTypes.customer){
        userStatus = constants.userStatuses.approved;
    } else {
        userStatus = constants.userStatuses.pending;
    }

    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        userStatus: userStatus,
        password: bcrypt.hashSync(req.body.password,8)
    };

    try{
        const userCreated = await User.create(userObj);
        const PostRes = {
            name: userCreated.name,
            userId:userCreated.userId,
            email:userCreated.email,
            userType: userCreated.userType,
            userStatus:userCreated.userStatus,
            createdAt:userCreated.createdAt,
            updatedAt:userCreated.updatedAt
        }
        res.status(201).send(PostRes);

    }catch(err){

        console.log("Error while creating user",err);
        res.status(500).send({
            message:"Some internal error while creating user"
        })
    }
}


// controller for sign in
    exports.signIn = async (req, res) => {
        //check if user id is present - if not present return 400

        const user = await User.findOne({userId : req.body.userId});

        if (!user){
            return res.status(400).json({message:`user Id passed : ${req.body.userId} is not correct`})
        }

        //check if status is approved
        if(user.userStatus != constants.userStatuses.approved){
            return res.status(400).json({message:`Can't allow the login as user status is not approved : Current status : ${user.userStatus}`})
        }

        //check if password matches
        const passwordIsValid = bcrypt.compareSync(req.body.password,user.password)
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken : null,
                message : "Invalid password"
            })
        }
        // generate jwt token and return

        // const token=jwt.sign({id:user.userId},config.secret,{
        //     expiresIn:120
        // });
        
        const token = jwt.sign(
            { id: user._id },
            config.secret,
            { expiresIn: 120 }
        );

        //return final response
        res.status(200).send({
            name:user.name,
            userId:user.userId,
            email:user.email,
            userStatus:user.userStatus,
            accessToken:token
        })

    }    