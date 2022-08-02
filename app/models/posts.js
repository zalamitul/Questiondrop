const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
    postid:{
        type:String,
        required:true,
        unique:true
    },
    userid:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    tags:[{
        type:String,
    }],
    likes:[{
        type:String,
    }],
    comments:[{
        userid:{
            type:String,
        },
        body:{
            type:String,
        }
        // ,
        // likes:{
        //     type:Number,
        //     default:0,
        // }
    }],
    date:{
        type:String,
        default:new Date().toDateString()
    }
});

const Post = new mongoose.model("Post",postSchema);

module.exports = Post;