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

//Writing actual routes below
router.get('/test', (req,res) => res.json({msg : 'Hello from Users.js'}));

//adding register route here
router.post('/register', (req,res)=> {
    User.findOne({ email : req.body.email})//here we are looking if a particular email id already exists in the collection before registering it
    .then(user => { //here "user" will contain the return result of findOne function
        if(user){ //if the result is not NULL throw an error
            return res.status(400).json({email : "email already exists"})
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

module.exports = router;

