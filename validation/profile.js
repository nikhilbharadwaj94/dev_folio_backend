//validator package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data){
    let errors = {};
    //i dont understand why we are doing his. It looks like we are just extracting the information here.
    data.handle = !isEmpty(data.handle)? data.handle : "";
    data.skills = !isEmpty(data.skills)? data.skills : "";
    data.status = !isEmpty(data.status)? data.status : "";
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(!validator.isLength(data.handle, {min :2, max: 40})){
        errors.handle = "handle must be between 2-40 characters";
    }
    if(validator.isEmpty(data.handle)){
        errors.handle = " Handle must not be empty";
    }
    if(validator.isEmpty(data.status)){
        errors.status = "Status is required";
    }
    if(validator.isEmpty(data.skills)){
        errors.skills = "Skills are required";
    }
    if(!isEmpty(data.website)){ //here we are checking the first isEmpty because the field is not mandatory and can be left blank
        if(!validator.isURL(data.website)){ //in case it is not left blank then we have to validate that it makes sense
            errors.website = "Not a valid URl";
        }
    }
    if(!isEmpty(data.youtube)){ 
        if(!validator.isURL(data.youtube)){ 
            errors.youtube = "Not a valid URl";
        }
    }
    if(!isEmpty(data.twitter)){ 
        if(!validator.isURL(data.twitter)){ 
            errors.twitter = "Not a valid URl";
        }
    }
    if(!isEmpty(data.facebook)){ 
        if(!validator.isURL(data.facebook)){ 
            errors.facebook = "Not a valid URl";
        }
    }
    if(!isEmpty(data.instagram)){ 
        if(!validator.isURL(data.instagram)){ 
            errors.instagram = "Not a valid URl";
        }
    }
    if(!isEmpty(data.linkedin)){ 
        if(!validator.isURL(data.linkedin)){ 
            errors.linkedin = "Not a valid URl";
        }
    }
    return{
        errors,
        isValid : isEmpty(errors)
    }
}