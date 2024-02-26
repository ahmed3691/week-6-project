const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://ahmed:ahmed369@brocamp.glfzlus.mongodb.net/");

connect.then(()=>{
    console.log("MongoServer connected :")
}).catch((err)=>{
    console.log(err)
    console.log("Database is not connected")
})

const signupSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{  
        type:String,
        requires:true
    }
})



const userCollection = new mongoose.model("users",signupSchema);
const adminCollection = new mongoose.model("admins",signupSchema)

module.exports = {userCollection,adminCollection}
