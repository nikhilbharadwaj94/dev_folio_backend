//This file will mainly contain all the posts that the user has made/posted.
//The main thing to note here is that we are making the application as mofular as possible.

const express = require("express");
const router = express.Router();
//Basically here we are just extractig the Router feature out of the express application

router.get('/test', (req,res) => res.json({msg : 'Hello from posts.js'}));

module.exports = router;