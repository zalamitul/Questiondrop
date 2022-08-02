const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    posts: [{
        postid: {
            type: String,
            required:true
        }
    }
    ]
});

const tag = new mongoose.model('tags', tagSchema);

module.exports = tag;