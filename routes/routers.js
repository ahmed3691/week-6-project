var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController")
const usercontroller = require("../controller/userController")


// User Routes

router.get("/",usercontroller.home)

router.post("/login",usercontroller.login)

router.get("/loggedIn",usercontroller.loggedIn);

router.get("/logout",usercontroller.logout)

router.get("/signup",usercontroller.getSignup).post("/signup",usercontroller.postSignup)


//Admin Routes

router.get("/createUser",adminController.createUser);

router.get("/deleteUser",adminController.deleteUser);

router.get("/editUser",adminController.editUser);

router.post("/updateUser",adminController.updateUser)

router.post("/searchUser",adminController.searchUser);

router.get('*',(req,res)=>{
    res.send('Page didnt found')
})

module.exports = router;
