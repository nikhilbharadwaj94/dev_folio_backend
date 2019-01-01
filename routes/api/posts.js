//This file will mainly contain all the posts that the user has made/posted.
//The main thing to note here is that we are making the application as mofular as possible.

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Validate Post
const validatePostInput = require("../../validation/post");

//Basically here we are just extractig the Router feature out of the express application

router.get('/test', (req,res) => res.json({msg : 'Hello from posts.js'}));

//@route GET api/posts
//@desc Get posts
//@access Public route
router.get("/", (req, res)=>{
    Post.find()
        .sort({date : -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound : "No posts found!"}));
});

//@route GET api/posts/:id
//@desc Get a particular post by its id
//@access Public route
router.get("/:id", (req, res)=>{
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound : "No post found with the given ID"}));
});

//@route POST api/posts
//@desc Create post
//@access Private route
router.post("/", passport.authenticate("jwt", {session : false}), (req,res)=>{

const {errors, isValid} = validatePostInput(req.body);
//check validation
if(!isValid){
    //if any errors then return 400 with error object
    return res.status(400).json(errors);
}

    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.body.user
     });
     newPost.save().then(post => res.json(post));
});

//@route DELETE api/posts/:id
//@desc Delete a particular post by its id
//@access Private route
router.delete("/:id", passport.authenticate("jwt", {session : false}), (req, res)=>{
    Profile.findOne({user : req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                .then(post => {
                    //Check for post owner so that only the owners will be able to delete it.
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({notauthorized : "User is not authorized to delete the post"})
                    }

                    //If the user ID's match we should be able to delete the post
                    post.remove().then(()=> res.json({success : true}));
                })
                .catch(err => res.status(404).json({postnotfound : "No post found"}));
            });
});

//@route POST api/posts/like/:like_id
//@desc like a particular post by its id
//@access Private route
router.post("/like/:like_id", passport.authenticate("jwt", {session : false}), (req, res)=>{
    Profile.findOne({user : req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        return res.status(400).json({alreadyliked : "User already liked this post"});
                    }

                    //Add user id to the likes array
                    post.likes.unshift({user : req.user.id});

                    //Now we will save so that the changes can take effect
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({postnotfound : "No post found"}));
            });
});

//@route POST api/posts/unlike/:like_id
//@desc unlike a particular post by its id
//@access Private route
router.post("/unlike/:like_id", passport.authenticate("jwt", {session : false}), (req, res)=>{
    Profile.findOne({user : req.user.id})
            .then(profile => {
                Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(404).json({notliked : "User has not yet liked the post. So unlike cannot be done"});
                    }
                    //get remove index
                    const removeIndex = post.likes.map(item => item.user.toString())
                                                   .indexOf(req.user.id);
                    
                    //Now we will splice the like out of the array
                    post.likes.splice(removeIndex, 1);

                    //Now we need to save in order for the changes to take effect
                    post.save().then(post => res.json(post));
                
                })
                .catch(err => res.status(404).json({postnotfound : "No post found"}));
            });
});

//@route POST api/posts/comments/:post_id
//@desc We will add comments to a particular post
//@access Private route
router.post('/comments/:post_id', passport.authenticate("jwt", {session: false}), (req, res)=>{
    const {errors, isValid} = validatePostInput(req.body);
    //check validation
    if(!isValid){
    //if any errors then return 400 with error object
    return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post =>{
            const newComment = {
                text : req.body.text,
                name : req.body.name,
                avatar : req.body.avatar,
                user : req.user.id
            };

            //Add to comments array
            post.comments.unshift(newComment);

            //save for the changes to take effect
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({postnotfound : "Post not found"}));
}
);

//@route DELETE api/posts/comments/:post_id/:comment_id
//@desc We will add comments to a particular post
//@access Private route
router.delete('/comments/:post_id/:comment_id', passport.authenticate("jwt", {session: false}), (req, res)=>{
   //We dont need any validation for deleting comments it seems. I feel this is wrong and only admin or the creator should be 
   //able to delete the respective comments
    Post.findById(req.params.id)
        .then(post =>{
            
            //first we need to see if comment exists
            if(post.comments.filter(comment => comment._id.toString()=== req.params.comment_id).length===0){
                return res.status(404).json({commentnotexists : "Comment does not exist"})
            }

            //get the index position of the comment to be deleted.
            const removeIndex = post.comments.map(item => item._id.toString())
                                             .indexOf(req.params.comment_id);
            
            //Now we will splice/ remove the comment from the post
            post.comments.splice(removeIndex, 1);
            post.save().then( post => res.json(post));
        })
        .catch(err => res.status(404).json({postnotfound : "Post not found"}));
}
);
//----------------x-------------------------------
module.exports = router;