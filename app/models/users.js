const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        minlength:3,
    },
    fullname:{
        type:String,
        required:true,
        minlength:3,
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email is already present"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    phone:{
        type:Number,
        min:10,
    },
    password:{
        type:String,
        required:true,
    },
    profession:{
        type:String,
        required:true,
    },
    domains:[{type:String}],
    posts:[{type:String}],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},"rajkumarshaileshbhairabari");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        console.log(token);
        return token;
    }catch(error){
        res.send("the error occurs" + error);
        console.log(error);
    }
}

const User = new mongoose.model("User",userSchema);

module.exports = User;