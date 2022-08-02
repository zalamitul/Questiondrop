const express = require('express');
const mongoose = require('mongoose');
const app = new express();

mongoose.connect('mongodb://localhost:27017/firstDatabase', (err) => {
    if (err) {
        console.log('Not connected to database' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

// middleware
app.use(express.json());

//Create a New Schema
const studentSchema = new mongoose.Schema({
    name:{type:String, required: true, minlength:3},
    email:{type:String,required:true,unique:[true,"Email id already present."]},
    phone:{type:Number,minlength:10,maxlength   :11,unique:true},
    address:{type:String}
});

// Create a new collection using model
const Student = new mongoose.model("Student",studentSchema);

// create a new student using promise
// app.post("/students",(req,res)=>{
//     let user = new Student(req.body);
//     // console.log(user)
//     user.save().then(()=>{
//         res.send(user);
//     }).catch((e)=>{
//         res.send(e)
//     });

//     // res.send("hello world")
// });
 
// create a new student using asynchronous
app.post("/students",async(req,res)=>{
   try{
    const User = new Student(req.body);
    const result = await User.save();
    res.status(201).send(result);
   }catch(e){
       res.status(400).send(e);
   }
})

// read the data of registred students
app.get("/students", async(req,res)=>{
    try{
        const users = await Student.find();
        res.send(users);
    }catch(e){
        res.status(201).send(e);
    }
})

// get the individual student data using id
app.get("/students/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const user = await Student.find({_id})
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

// update students by it id
app.patch("/students/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const result = await Student.findByIdAndUpdate(_id,req.body,{new: true});        
        res.send(result); 
    }catch(e){

    }
});

// update students by it id
app.delete("/students/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const result = await Student.findByIdAndDelete({_id});
        if (!_id) {
            return res.status(400).send()
        }
        res.send(result);
    }catch(e){
        res.status(500).send(e)
    }
})

// listening on port
app.listen(process.env.PORT || 8000,()=>{
    console.log("server is running")
})