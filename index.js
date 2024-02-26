var express = require("express");
var bodyParser = require("body-parser");
var path = require("path")
var { v4: uuidv4 } = require('uuid');
var session = require("express-session")
var router=require('./routes/routers');
var dotenv = require("dotenv");
var morgan = require("morgan");


dotenv.config({path :"config.env"})
const app = express();
const port = process.env.PORT||3000;

app.use(morgan("tiny"))

app.set("view engine", "ejs") 

app.use(express.static("public"))

app.use(express.json());
                                                                                                    ; //can be false//

// app.use('/css',express.static(path.resolve(__dirname,'public/css')))
// app.use('/img',express.static(path.resolve(__dirname,'public/img')))
// app.use('/js',express.static(path.resolve(__dirname,'public/js')))

app.use(session({
    secret : uuidv4(),
    resave : false,
    saveUninitialized: true
}))


app.use((req,res,next)=>{
    res.set('Cache-control','no-store,no-cache')
    next()
})



app.use("/",router)

// app.use("/admin",)

app.listen(port,()=>{
    console.log(`running on ${port}`) 
});