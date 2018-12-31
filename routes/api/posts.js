//This file will mainly contain all the posts that the user has made/posted.
//The main thing to note here is that we are making the application as mofular as possible.

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");

//Validate Post
const validatePostInput = require("../../validation/post");

//Basically here we are just extractig the Router feature out of the express application

router.get('/test', (req,res) => res.json({msg : 'Hello from posts.js'}));

//@route POST api/posts
//@desc Create post
//@access Private route
router.post("/", passport.authenticate("jwt", {session : false}), (req,res)=>{

    const {errors, isValid} = validatePostInput(req.body);
//check validation
if(!isValid){
    //if any errors then return 400 with error object
    return res.status(400).json(errors);
}

    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.body.user
     });
     newPost.save().then(post => res.json(post));
});


//----------------x-------------------------------
module.exports = router;