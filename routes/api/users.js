// this file will mainly deal with authentication. Eg: username password

const express = require("express");
const router = express.Router();
//Basically here we are just extractig the Router feature out of the express application

router.get('/test', (req,res) => res.json({msg : 'Hello from Users.js'}));

module.exports = router;

