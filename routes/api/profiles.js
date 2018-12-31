//This will mainly contain the information about the person. Eg profile picture, Bio etc.

const express = require("express");
const router = express.Router();
//Basically here we are just extractig the Router feature out of the express application
const mongoose = require("mongoose");
const passport = require("passport");

//Load the required models/collections/data-tables here
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//Loading validation route here
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//We will be defininig the profile routes below --------------------x-----------------------
router.get('/test', (req,res) => res.json({msg : 'Hello from profiles.js'}));

//@route GET api/profile
//@desc get current users profile
//@access Private route
router.get("/", passport.authenticate("jwt", {session: false}), (req, res)=>{
    const errors = {};
    //Here req will have the information of what is being requested because we have already logged in. Also Profile collection has
    //a reference to the User collection so we will be able to search for the user id within the profile collection as well.
    Profile.findOne({user : req.user.id})
            .populate('user', ['name', 'avatar'])
            .then(foundProfile => {
                if(!foundProfile){
                    errors.noprofile = "there is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(foundProfile);
            })
            .catch(err => res.status(404).json(err));
});

//@route POST api/profile/handle/:handleID
//@desc view the profile using the handle
//@access public route beause people should be able to view the profiles freely
router.get("/handle/:handle", (req, res) =>{
    const errors = {};
    Profile.findOne({handle: req.params.handle})
            .populate('user', ['name', 'avatar'])
            .then(foundProfile =>{
                if(!foundProfile){
                    errors.noprofile = "There is no profile for this user";
                    res.status(404).json(errors);
                }else{
                    res.json(foundProfile);
                }
            })
            .catch(err => res.status(404).json(errors));
});

//@route GET api/profile/user/:user_id
//@desc view the profile using the user_id
//@access public route
router.get("/user/:user_id", (req, res) =>{
    const errors = {};
    Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar'])
            .then(foundProfile =>{
                if(!foundProfile){
                    errors.noprofile = "There is no profile for this user";
                    res.status(404).json(errors);
                }else{
                    res.json(foundProfile);
                }
            })
            .catch(err => res.status(404).json({profile: "there is no profile for this user"}));
});

//@route GET api/profile/all
//@desc view all the user profiles
//@access public route
router.get("/all", ()=>{
    const errors = {};
    Profile.find()
            .populate('user', ['name', 'avatar'])
            .then(foundProfiles=>{
                if(!foundProfiles){
                    errors.noprofile = "there are no profiles";
                    return res.status(404).json(errors);
                }
                res.json(foundProfiles);
            })
            .catch(err => res.status(404).json({profile : "There are no profiles"}));
});

//@route POST api/profile
//@desc create or update users profile
//@access Private route
router.post("/", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //performing validation here
    const {errors, isValid} = validateProfileInput(req.body);
    if(!isValid){
        //Return error with 400 status as it is a validation error
        return res.status(400).json(errors);
    }

    //Now we will get the various fields in the profile collection and store values in them so that we can create the particular 
    //Profile collection later on
    const profileFields = {};
    profileFields.user = req.body.user;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubUserName) profileFields.githubUserName = req.body.githubUserName;
    if(req.body.location) profileFields.location = req.body.location;
    //basically we are checking if the required information is available in the post request, storing them in a var called profileFields
    //and finally we will create a collection will all the collected information.

    //Brad said that the skills will initially be in CSV format and we need to convert it into an array. I dint understand How and Why 
    //CSV in the first place.
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    //in the Profile collection we have given that the social field is an object. So if we directly try to push info into profileFields.social
    //we will apparently get an error it seems. So what we will do is first initialize it as an empty object and then push info into the object.
    profileFields.social = {};

    //Now we will extract the info from the POST route and place it inside the object
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    //Upto this point we have created the gian object called profileFields but we still dont know if we need to create it or update it
    //so below we will first check if the profile already exists and if it does then we will update it otherwise create it
    Profile.findOne({user : req.user.id}).then(foundProfile =>{
        if(foundProfile){
            //Since profile was found i.e. it already exists we simply need to update it
            Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set : profileFields},
                {new : true}
            ).then(profile => res.json(profile));
        }else
        {
            //This point will be reached if no profile was found with the given user details. In this case we will need to create it.

            //Before we create a new user we will need to check if the handle already exists as we dont want duplicates in the database
            Profile.findOne({handle : profileFields.handle}).then(foundProfile =>{
                if(foundProfile){
                    errors.handle = "the handle already exists";
                    res.status(400).json(errors);
                }
            });

            //if the profile is new, then we will create it as shown below.
            new Profile(profileFields).save().then(profile => res.json(profile));
        }
    });

});

//@route POST api/profile/experience
//@desc add experience to the profile. before being able to do this we need to have logged in first.
//@access Private route
router.post("/experience", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //performing validation here
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        //Return error with 400 status as it is a validation error
        return res.status(400).json(errors);
    }

    Profile.findOne({user : req.user.id})
            .then(foundProfile => {
                const newExp = {
                    title : req.body.title,
                    company: req.body.company,
                    location : req.body.location,
                    from : req.body.from,
                    to : req.body.to,
                    current : req.body.current,
                    description : req.body.description
                }
                //Add experience to the profile
                foundProfile.experience.unshift(newExp);

                foundProfile.save().then(updatedExpProfile => res.json(updatedExpProfile));
            });
});

//@route POST api/profile/education
//@desc add education to the profile. before being able to do this we need to have logged in first.
//@access Private route
router.post("/education", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //performing validation here
    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid){
        //Return error with 400 status as it is a validation error
        return res.status(400).json(errors);
    }

    Profile.findOne({user : req.user.id})
            .then(foundProfile => {
                const newEdu = {
                    school : req.body.school,
                    degree: req.body.degree,
                    fieldOfStudy : req.body.fieldOfStudy,
                    from : req.body.from,
                    to : req.body.to,
                    current : req.body.current,
                    description : req.body.description
                }
                //Add experience to the profile
                foundProfile.education.unshift(newEdu);

                foundProfile.save().then(updatedEduProfile => res.json(updatedEduProfile));
            });
});

//@route DELETE api/profile/experience/:exp_id
//@desc delete experience from the profile. before being able to do this we need to have logged in first.
//@access Private route
router.delete("/experience/:exp_id", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //We will be able to proceed with delete only when the user is logged in.
    Profile.findOne({user : req.user.id})
            .then(foundProfile => {
                const removeIndex = foundProfile.experience.map(item => item.id)
                .indexOf(req.params.exp_id);
            //basically at this point removeIndex will contain the index pos of the experience to be removed.

            //Now we will spilce the item out of the array. Splice method adds/removes from array and return the items
            foundProfile.experience.splice(removeIndex, 1);

            //now we need to update in mongoDB by calling the save function.
            foundProfile.save().then(updatedProfile => res.json(updatedProfile));

            })
            .catch(err => res.status(404).json(err));
});

//@route DELETE api/profile/education/:edu_id
//@desc delete education from the profile. before being able to do this we need to have logged in first.
//@access Private route
router.delete("/experience/:edu_id", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //We will be able to proceed with delete only when the user is logged in.
    Profile.findOne({user : req.user.id})
            .then(foundProfile => {
                const removeIndex = foundProfile.education.map(item => item.id)
                .indexOf(req.params.edu_id);
            //basically at this point removeIndex will contain the index pos of the experience to be removed.

            //Now we will spilce the item out of the array. Splice method adds/removes from array and return the items
            foundProfile.education.splice(removeIndex, 1);

            //now we need to update in mongoDB by calling the save function.
            foundProfile.save().then(updatedProfile => res.json(updatedProfile));

            })
            .catch(err => res.status(404).json(err));
});

//@route DELETE api/profile/
//@desc delete the user and the profiles associated with it
//@access Private route
router.delete("/", passport.authenticate("jwt", {session: false}), (req, res)=>{
    //We will be able to proceed with delete only when the user is logged in.
    Profile.findOneAndRemove({user : req.user.id})
            .then(() => {
                User.findOneAndRemove({_id : req.user.id});
            })
            .then(()=> res.json({success : true}));
});

//The below line will expose the routes defined above to the other files like server.js
module.exports = router;
