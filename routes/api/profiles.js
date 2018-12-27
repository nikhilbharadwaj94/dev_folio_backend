//This will mainly contain the information about the person. Eg profile picture, Bio etc.

const express = require("express");
const router = express.Router();
//Basically here we are just extractig the Router feature out of the express application

router.get('/test', (req,res) => res.json({msg : 'Hello from profiles.js'}));

module.exports = router;
