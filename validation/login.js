//This package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data){
    let errors = {};
    //i dont understand why we are doing his. It looks like we are just extracting the information here.
    data.email = !isEmpty(data.email)? data.email : "";
    data.password = !isEmpty(data.password)? data.password : "";
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(!validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }
    if(!validator.isEmail(data.email)){
        errors.email =" email is invalid!"
    }
    if(validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }
    return{
        errors,
        isValid : isEmpty(errors)
    }
}