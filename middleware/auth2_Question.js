const jwt = require("jsonwebtoken");
const User = require("../app/models/users");

const auth = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"rajkumarshaileshbhairabari");
        // console.log(verifyUser);
        const user = await User.findOne({_id:verifyUser._id});
        // console.log(user);
        req.token=token;
        req.user=user;
        next();
    } catch(error){
        res.end(false);
        // res.status(401).send(error);
    }
}

module.exports = auth;