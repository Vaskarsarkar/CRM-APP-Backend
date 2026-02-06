const express =require("express");
const app=express();
require("dotenv").config();
const mongoose = require("mongoose");
const User=require("./models/user.model");
const bcrypt =require("bcryptjs");

app.use(express.json());

// Database connection
(async ()=>{

    try{
        await mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/crm_db');
        console.log("Connected to MongoDB");

        // Seed initial data if collection is empty
        const user=await User.findOne({userId:"admin"});

        if(!user){
            const admin =await User.create({
                name:"Vaskar",
                userId:"admin",
                email:"admin@example.com",
                userType:"ADMIN",
                // userStatus:"APPROVED",
                password: bcrypt.hashSync("Admin@123",10)
            });
            console.log("Admin user created");
        } else {
            console.log("Admin user already exists");
        }

    }catch(err){        
        console.error("Error connecting to MongoDB:", err.message);
    }
})();


// stich the  routes
const authRoutes = require("./routes/auth.routes");
app.use("/crm/api/v1",authRoutes);

const userRoutes = require("./routes/user.routes")
app.use("/crm/api/v1",userRoutes);

const ticketRoutes = require("./routes/ticket.routes");
app.use("/crm/api/v1",ticketRoutes);

// Start the server
// const PORT=process.env.PORT ;
// const PORT= 8080;
app.listen( process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});     

// app.listen( process.env.PORT ,()=>{
//     console.log(`Server is running on port ${process.env.PORT}`);
// }); 