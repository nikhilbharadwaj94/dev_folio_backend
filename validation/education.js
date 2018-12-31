//validator package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data){
    let errors = {};
    //i dont understand why we are doing his. It looks like we are just extracting the information here.
    data.school = !isEmpty(data.school)? data.school : "";
    data.degree = !isEmpty(data.degree)? data.degree : "";
    data.from = !isEmpty(data.from)? data.from : "";
    data.fieldofstudy = !isEmpty(data.fieldofstudy)? data.fieldofstudy : "";
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(!validator.isEmpty(data.school)){
        errors.school = "School field is required";
    }
    if(!validator.isEmpty(data.degree)){
        errors.degree = "Degree field is required";
    }
    if(!validator.isEmail(data.fieldofstudy)){
        errors.fieldofstudy =" Field of study field is required!"
    }
    if(validator.isEmpty(data.from)){
        errors.from = "from field is required!";
    }
    return{
        errors,
        isValid : isEmpty(errors)
    }
}