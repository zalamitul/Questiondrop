const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    tag:{
        type:String,
        required:true,
    },
    posts:[{
        type:String,
    }]
});

const Search = new mongoose.model('Search',searchSchema);

module.exports = Search;