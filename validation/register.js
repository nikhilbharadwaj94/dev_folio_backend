//This package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data){
    let errors = {};
    //i dont understand why we are doing his. It looks like we are just extracting the information here.
    data.name = !isEmpty(data.name)? data.name : "";
    data.email = !isEmpty(data.email)? data.email : "";
    data.password = !isEmpty(data.password)? data.password : "";
    data.password2 = !isEmpty(data.password2)? data.password2 : "";

    if(!validator.isLength(data.name, {min:2, max:30})){
        errors.name =" Name must be between 2-30 characters"
    }
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(validator.isEmpty(data.name)){
        errors.name = "Name field is required";
    }
    if(!validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }
    if(!validator.isEmail(data.email)){
        errors.email =" email is invalid!"
    }
    if(validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }
    if(!validator.isLength(data.password, {min : 6, max:20})){
        errors.password = "Password should be between 6 and 30 characters";
    }
    if(validator.isLength(data.password2, {min : 6, max:20})){
        errors.password2 = "Password2 should be between 6 and 30 characters";
    }
    if(!validator.equals(data.password2, data.password)){
        errors.password2 = "passwords must match";
    }
    return{
        errors,
        isValid : isEmpty(errors)
    }
}