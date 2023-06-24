require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,  encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});



app.post("/register",function(req,res){

    const newUser = new User({
        email: req.body.username,
        password : req.body.password
    });
    
    newUser.save();
    res.redirect("/login");

});

app.post("/login",function(req,res){

    input_email = req.body.username;
    input_password = req.body.password;

    User.findOne({email:input_email}).then(function(foundId){

        console.log(foundId);
        if(foundId)
        {
            // console.log(foundId.password);
            if(foundId.password===input_password)
            {
              console.log("Successfully logged in!");
              res.render("secrets");
            }
            else
            {
                console.log("Incorrect password or Username!");
            }

        }
        else
        {
            console.log("User Not found!");
        }
    });

});









app.listen(3000,function(){
    console.log("Server is started on port 3000.");
});