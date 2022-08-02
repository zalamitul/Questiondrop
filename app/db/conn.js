
const mongoose = require("mongoose");
const DB = process.env.MONGODB_URI;
mongoose.connect(DB).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(`sorry no connection ${err}`);
});

// mongodb://localhost:27017/QDrop
