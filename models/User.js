//I will be creating User collection here

const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declaring that we will be using a schema here called Schema

//create schema here
const userSchema = new Schema({
    name : {
        type : String,
        required: true
    }, //here name represents a field
    email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    avatar : {
        type : String
    },
    date : {
        type : Date,
        default: Date.now
    }
});

//For some reason i am writing the register logic here instead of in a new file.

var User = mongoose.model('users', userSchema);
module.exports = User;