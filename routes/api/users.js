// this file will mainly deal with authentication. Eg: username password

const express = require("express");
const router = express.Router();
//Basically here we are just extractig the Router feature out of the express application

//Load User model as we will refer to it here
const User = require("../../models/User");

//This is for the avatar
const gravatar = require("gravatar");

//Now we will import bcrypt package to encrypt the password
const bcrypt = require('bcryptjs');

//importing JWT
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Passport import
const passport = require("passport");

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Writing actual routes below------------------------x--------------------------------
router.get('/test', (req,res) => res.json({msg : 'Hello from Users.js'}));

//adding register route here
router.post('/register', (req,res)=> {
    const {errors, isValid} = validateRegisterInput(req.body);
    //check vaidity
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email : req.body.email})//here we are looking if a particular email id already exists in the collection before registering it
    .then(user => { //here "user" will contain the return result of findOne function
        if(user){ //if the result is not NULL throw an error
            errors.email = "Email already exists";
            return res.status(400).json(errors)
        }else{ //create a new user

            const avatar = gravatar.url(req.body.email, s = '200', r = 'pg' , d = 'mm');
            const newUser = new User({
                name : req.body.name,
                email :req.body.email,
                avatar : avatar,    //for this we will be using a package called gravatar which we will have to install using npm
                password : req.body.password
            });
            bcrypt.genSalt(10, (err,salt)=>{ //here we are basically creating a salt which is a string used for encryption
                bcrypt.hash(newUser.password, salt, (err,hash)=>{ //At this point we are hashing the password with the salt
                    if(err) throw err;
                    newUser.password = hash; //storing the hashed password into the new user object
                    newUser.save() //This is a mandatory thing we have to do for changes to take effect in mongoDB
                            .then(user => res.json(user)) //if successful we are retuning object
                            .catch(console.log(err));   //if err we will just throw it to the user
                });
            });
        }
    }) 
});
//Here i will be writing the code to authenticate the user Login
//The main function here is to return JWT
router.post('/login', (req,res)=>{
    const {errors, isValid} = validateLoginInput(req.body);
    //check vaidity
    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password; // here we are basically extractig the user entered information

    //Now we need to find the matching email in the DB and validate the password provided.
    User.findOne({email : email}).then(user =>{
        if(!user){
            errors.email = "email not found";
        return res.status(404).json(errors);
        }

        //if the user variable is not blank we need to check the password
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                //if matched then we will attach a json web token which is attached with some extracted user info along with secret key and all
                const payload = { id : User.id, name : User.name, avatar : User.avatar}

                //Now we will have to sign the token
                jwt.sign(payload , keys.secret, {expiresIn : 3600}, (err, token)=>{
                    res.json({success : true, token : 'Bearer ' + token});
                });
            }else{
                errors.password = "password incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});
//adding a protected route for passport authentication // here we are indicating that we will not be using sessions
router.get("/current", passport.authenticate("jwt", {session: false}), (req,res)=>{
    res.json(req.user);
}); 

module.exports = router;

