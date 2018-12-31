const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//now i will create a Post schema from which i will initialize the collection later on
const postSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
    texts : {
        type : String,
        required : true
    },
    name : {
        type : String
    },
    avatar : {
        type : String
    },
    likes : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref : "user"
            }
        }
    ],
    comments : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref : "user"
            },
            text : {
                type : String,
                required : true
            },
            name : {
                type : String
            },
            avatar : {
                type : String
            },
            date : {
                type : Date,
                default : Date.now
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = Post = mongoose.model('post', postSchema);