const bcrypt = require('bcrypt');
const {userCollection,adminCollection} = require("../model/database")

let editUserId;
let userDisplay;


const createUser = async (req,res)=>{
    res.render("createUser")
}

const deleteUser  = async (req,res)=>{
    let id = req.query.id;
    console.log(id);
    await userCollection.deleteOne({_id:id});   
    res.redirect("/");
}

const editUser = async (req,res)=>{   
    if(req.query.id){
        editUserId = req.query.id;
    }
    userToEdit = await userCollection.findOne({_id:editUserId});
    console.log(userToEdit)
    res.render("userEdit",{user:userToEdit,message:req.session.message})
    
}

const updateUser = async (req,res)=>{

    const updatedUserDetails = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        gender: req.body.gridRadios,
        email : req.body.email,
        password: req.body.password
    }

    try{
        if (!updatedUserDetails.firstName.trim() || !updatedUserDetails.lastName.trim() || !updatedUserDetails.password.trim()) {
            // Respond with an error message
             req.session.message = "Fields cannot be empty"
             res.redirect('/editUser');
          }else{
                const hashedPassword = await bcrypt.hash(req.body.password,10);
                updatedUserDetails.password = hashedPassword;
                await userCollection.updateOne({_id:editUserId},{ $set :updatedUserDetails})
                res.redirect("/")
        }
        
    }catch(error){
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }   
}

const searchUser = async (req,res)=>{
    try{
    let userToFind = req.body.userToFind;
     
    
     userDisplay = await userCollection.find({  $or: [
        { firstName: { $regex: new RegExp(".*" + userToFind + ".*", "i") } },
        { lastName : { $regex : new RegExp(".*" + userToFind + ".*","i")}},
        { email : { $regex : new RegExp(".*" + userToFind + ".*","i")}}
    ]})
    console.log(userDisplay)
    res.render('admin',{users:userDisplay})
    }catch{
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
     
}

module.exports = {

    createUser,
    deleteUser,
    editUser,
    updateUser,
    searchUser
    
}