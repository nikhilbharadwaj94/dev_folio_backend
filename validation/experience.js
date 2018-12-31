//validator package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data){
    let errors = {};
    //i dont understand why we are doing his. It looks like we are just extracting the information here.
    data.title = !isEmpty(data.title)? data.title : "";
    data.company = !isEmpty(data.company)? data.company : "";
    data.from = !isEmpty(data.from)? data.from : "";
    data.company = !isEmpty(data.company)? data.company : "";
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(!validator.isEmpty(data.title)){
        errors.title = "Job title field is required";
    }
    if(!validator.isEmail(data.company)){
        errors.company =" company field is required!"
    }
    if(validator.isEmpty(data.from)){
        errors.from = "from field is required!";
    }
    return{
        errors,
        isValid : isEmpty(errors)
    }
}