const bcrypt = require('bcrypt');
const {userCollection,adminCollection} = require("../model/database")
var validator = require("validator");


let userDisplay;

const home = async (req,res)=>{

    userDisplay = await userCollection.find({});
    let message = req.session.message
    req.session.message =''
    console.log(req.session.user)
    if(req.session.user==="ahmed@gmail.com"){
        res.render("admin",{users:userDisplay})
    }
    else if(req.session.user){
        res.redirect("/loggedIn");
    }else{
        res.render('content',{ title: "Login System",message});
    }

}

const login = async (req,res)=>{

    try{

        if (!validator.isEmail(req.body.userEmail)) {
            req.session.message = 'Invalid email format';
            res.redirect("/");
            return;
        }
        
        const userAdmin = await adminCollection.findOne({
            email : { $regex : new RegExp(req.body.userEmail,'i')}
        });
        const existingUser = await userCollection.findOne({
            email : { $regex : new RegExp(req.body.userEmail,'i')}      
        });
         userDisplay = await userCollection.find({});
      
        if(userAdmin){
            const passwordMatch = await bcrypt.compare(req.body.userPassword,userAdmin.password);
            if(passwordMatch){
                adminMail = userAdmin.email;
                req.session.user = adminMail;
                console.log(req.session.user)
             
                res.render('admin',{users:userDisplay})
            }else{
                req.session.message = "Invalid credentials"
                res.redirect("/");
            }
        }
        else if(existingUser){
            const passwordMatch = await bcrypt.compare(req.body.userPassword,existingUser.password);
            if(passwordMatch){
                const userName = existingUser.firstName+" "+existingUser.lastName;
                req.session.user = userName;      
                res.redirect("loggedIn");
            }else{
                req.session.message = "Invalid credentials"
                res.redirect("/");
            }              
        }else{
            req.session.message = "This user doesnot exist"
            res.redirect("/");
        }
    }catch(error){
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
       
    }
    
}

const loggedIn  = (req,res)=>{
    if(req.session.user && req.session.user!="ahmed@gmail.com" ){
        console.log("logedIn")
        console.log(req.session.user)
        res.render("loggedIn",{user : req.session.user})
    }else{
        res.redirect("/")
    }
}

const logout = (req,res)=>{
    
    req.session.destroy();
    res.redirect("/");
    console.log("logged out")
}

const getSignup = async (req,res)=>{
    let message = req.session.message;
    userDisplay = await userCollection.find({});
    if(req.session.user==="ahmed@gmail.com"){
        res.render("admin",{users:userDisplay})
    }
    else if(req.session.user){
        res.redirect("/loggedIn");
    }else{
        // res.render('content',{ title: "Login System"/*,message*/});
        res.render("signUp",{message:message})
    }
    
}

const postSignup = async (req,res)=>{

    try{

        if (!validator.isEmail(req.body.email)) {
            req.session.message = 'Invalid email format';
            console.log(req.session.message)
            // res.send(
            //     '<script>alert("Invalid email format");' +
            //     'window.location.href="/signup";</script>'
            // );
            res.redirect('/signup')
            
            return;
        }
    
        const newUser ={
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            gender: req.body.gridRadios,
            email : req.body.email,
            password: req.body.password
        }
    
        const userExist = await userCollection.findOne({email: newUser.email})
        if(!userExist){
            if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.password.trim()) {
                // Respond with an error message
                req.session.message = "Fields cannot be empty"
                 res.redirect('/signup');
              }else{

                const hashedPassword = await bcrypt.hash(req.body.password,10);
                newUser.password = hashedPassword;
                const userData = await userCollection.insertMany(newUser);
                req.session.message = "Account created successfully"
                console.log(req.session.user)
                res.redirect("/");
                console.log(newUser);

              }
        }else{
            req.session.message = "User already exist."
            res.redirect("/signup")
        }
    }catch(error){
        console.error('Error during login:', error);
        res.status(500).send(error);
    }
}

module.exports = {

    home,
    login,
    logout,
    loggedIn,
    getSignup,
    postSignup

}

