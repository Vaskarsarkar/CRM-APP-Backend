const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const Users = require("../models/user.model");
const constants = require("../utils/constant");

// const verifyToken = (req,res,next)=>{
//     const token = req.headers["x-access-token"];

//     if(!token){
//         return res.status(403).send({
//             message:"No access token has passed"
//         })
//     }

//     // verify the token
//     jwt.verify(token,config.secret,(err,decoded)=>{
//         if(err){
//             return res.status(401).send({
//                 message:"Unauthorized!"
//             });
//         }

//         req.userId = decoded.id;
        
//     });

//     next();

// }

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No access token has passed"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        req.userId = decoded.id;
        
    });
    next();
};

const isAdmin =async (req,res,next)=>{
    const user = await Users.findById(req.userId);

    if(user && user.userType == constants.userTypes.admin){
        next();
    } else {
        return res.status(403).send({
            message:"Require Admin Role"
        });
    }
}

module.exports = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};