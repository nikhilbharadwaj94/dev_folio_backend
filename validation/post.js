//validator package is used to validate strings. But one catch is it HAS TO BE A STRING!!
const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data){
    let errors = {};
    //We are only checking if the text field is empty because almost ever other required input is referenced from the user collection.
    data.text = !isEmpty(data.text)? data.text : "";
    
    //If we want to enforce some mandatory fields, below example shows how we will do it
    if(!validator.isLength(data.text, {max : 300})){
    errors.text = "Post must not be longer than 300 characters";
    }

    if(!validator.isEmpty(data.text)){
        errors.text = "Text field is required";
    }
   
    return{
        errors,
        isValid : isEmpty(errors)
    }
}