const mongoose   = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const loginSchema = new Schema({
    username: {
        type: String,
        required: [true,'Please enter your name'],
        minlength:3,
        trim: true
    },
    email: {
        required:[true,'Email is required'],
        type: String,
        unique:[true,'Email already present'],
        validate: [{validator: validator.isEmail, msg: 'invalid email address'}]
    },
    password: {
        type: String,
        required: [true,'Please enter your password']
    },
});



module.exports = mongoose.model('user',loginSchema);