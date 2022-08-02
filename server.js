const express = require('express');
const app = new express();
const path = require("path");
require("./app/db/conn");
const User = require("./app/models/users");
const Post = require("./app/models/posts");
const Tag = require("./app/models/tags");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const auth = require("./middleware/auth");
const auth2_Question = require("./middleware/auth2_Question");

const { Console } = require('console');
const { sendFile, json, redirect } = require('express/lib/response');
const fs = require('fs');
const uuid = require('uuid');


const router = express.Router();
const appRoutes = require('./app/routes/api')(router);
const PORT = process.env.port || 8080;

// bcryptjs encryption function 
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
}

// bcryptjs compare function 
const comp = async (a, b) => {
    const c = await bcrypt.compare(a, b);
    return c;
}

// middlewarej
app.use(express.static(path.join(__dirname, './app/public/views')))
app.use(express.static('./app/public/')); // this is for css folder and js
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/api", appRoutes)

app.use(express.json());

//home direcctory
app.get("/", async (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

//logout
app.get('/logout', auth, async (req, res) => {
    try {
        
        res.clearCookie("jwt");
        req.user.tokens = [];
        await req.user.save();
        res.redirect('/login');
    } catch (err) {
        console.log(`hii raj, the error is ${err}`);
    }
});

//will send login page
app.get("/login", async (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname,'/app/public/views/login.html'))
})
app.get("/askquestion",auth,async(req,res)=>{
    res.sendFile(path.join(__dirname,'/app/public/views/ask-question.html'))
    
})
//for signup 
app.post("/views/signup", async (req, res) => {
    console.log(req.body);
    try {
        const password = req.body.password;
        const passwordHash = await securePassword(password);
        const user = new User(req.body);
        user.password = passwordHash;
        const domains = req.body.domains.split(',');
        user.domains = domains
        await user.save();
        res.redirect("/login");
    } catch (e) {
        res.status(400).send(e);
    }
})

//push the cmt in comment array
app.post("/reply", auth, async (req, res) => {
    try {
        const pid = req.body.postid;
        req.body.userid = req.user.userid;
        delete req.body.postid;
        Post.update(
            { postid: pid },
            { "$push": { comments: [req.body] } },
            function (err, raw) {
                if (err) return handleError(err);
                console.log('The raw response from Mongo was ', raw);
            }
        );
        res.redirect('/');
    } catch (e) {
        res.status(400).send(e);
    }
});

//for likes
app.post("/like", auth, async (req, res) => {
    console.log("entered in like request");
    const pid = req.query.postid;
    // console.log(pid);
    const userid = req.user.userid;
    // console.log(userid);
    // const filter = {postid:pid};
    // const update = {$push:{likes:userid}};
    const doca = await Post.findOne({ postid: pid });
    console.log(`this is doc ${doca}`);
    let value = doca.likes.find(id => userid == id)
    if(value){
        const temp = await Tag.find();
        console.log(temp)
        res.send(temp);
        res.end();
    }
        // res.sendStatus(200)
    else
        { console.log(value)
        const doc = await Post.findOneAndUpdate({ postid: pid }, { $addToSet: { likes: userid } }, { new: true });
        console.log(`this is doc ${doc}`);
        console.log(value)
        // res.send({ msg: 'tobi' })    
            res.send([{msg:'tobi2'}])

        res.end()

        }
        // res.redirect(`/Question?postid=${pid}`);
});

//
app.get("/questions", auth, async (req, res) => {
    console.log(`this is cookie : ${req.cookies.jwt}`);
    res.sendFile(path.join(__dirname + '/app/public/views/questions.html'));
});

//
app.get("/post", auth, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname + '/app/public/views/post.html'));
    }
    catch (err) {
        res.status(400).send(err);
    }
});

//tags
app.post("/Availabletags", async (req, res) => {
    const temp = await Tag.find();
    console.log(temp)
    res.send(temp);
    res.end();
})

//particular tag
app.get("/tags/:tag", async (req, res) => {
    console.log(req.params.tag);
    const temp = await Tag.findOne(req.params, { _id: false, tag: false, posts: { _id: false } });
    let z = temp.posts;
    let mappedArray = await z.map(item => item.postid);
    console.log(mappedArray)
    const y = await Post.find({
        'postid': {
            $in: mappedArray
        }
    },{_id:false,comments:{_id:false}});
    res.send(y);
    res.end();

    // console.log(req.params);
    // const temp = await Tag.findOne(req.params, { _id: false, tag: false, posts: { _id: false } });
    // let z = await temp.posts
    // let mappedArray = await z.map(item => item.postid);
    // console.log(mappedArray)
    // const y = await Post.find({
    //     'postid': {
    //         $in: mappedArray
    //     }
    // }, { _id: false, comments: { _id: false } });
    // let data = await fs.readFileSync(path.join(__dirname + '/app/public/views/tagsPosts.html'), 'utf8', function (err, data) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     return data;
    // });
    // var result = data.replace(/response.data/g, y);
    // res.end(result);
})

//
app.post("/posts", auth, async (req, res) => {
    try {
        const post = new Post(req.body);
        console.log(req.body)
        post.userid = req.user.userid;
        post.postid = uuid.v4();
        const postid=post.postid;
        console.log(postid);
        const tags = req.body.tags.split(',');
        post.tags = tags;
        post.save();
        // const doc = await Post.findOneAndUpdate({ postid: pid }, { $addToSet: { likes: userid } }, { new: true });
        await User.findOneAndUpdate({userid:req.user.userid},{$addToSet:{posts:postid}},{new:true});
        await tags.forEach(async element => {
            const x = await Tag.findOne({ tag: element });
            if (x == null) {
                const tag = new Tag({ tag: element, posts: { postid: post.postid } })
                await tag.save();
                console.log("saved")
            }
            else {
                var z = await Tag.updateOne({ tag: element }, { "$push": { posts: [{ postid: post.postid }] } }, function (err, docs) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Original Doc : ", docs);
                    }
                }).clone();
            }
        });
        res.redirect('/');
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//login post
app.post("/login", async (req, res) => {
    try {
        const email = req.body.emailaddress;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (user == null) {
            console.log("adq");
            let index = await fs.readFileSync(path.join(__dirname + '/app/public/views/login.html'), 'utf8');
            index = index.replace('display: none;', 'display: block;'); //MODIFY THE FILE AS A STRING HERE
            console.log("adw");
            return res.send(index);
        }
        else {
            if (await comp(password, user.password)) {
                console.log("aaaaad")
                const token = await user.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 259200000),
                    httpOnly: true
                });
                res.redirect("/")
            }
            else {
                console.log("asdt")
                let index = await fs.readFileSync(path.join(__dirname + '/app/public/views/login.html'), 'utf8');
                index = index.replace('display: none;', 'display: block;'); //MODIFY THE FILE AS A STRING HERE
                return res.send(index);
            }
        }
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
})

// read the data of registred students
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.status(201).send(e);
    }
})

//authenticate user
app.get("/authentication", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "rajkumarshaileshbhairabari");
        const user = await User.findOne({ _id: verifyUser._id });
        req.token = token;
        req.user = user;
        res.send(req.user.username);
        res.end();
    } catch (error) {
        res.end(0);
    }
})

//load the question in feed
app.get("/feedload", async (req, res) => {
    try {
        const posts = await Post.find()
        res.send(posts);
        console.log(posts)
        res.end();
    } catch (e) {
        res.status(400).send(e);
    }
})

//new page new question
app.get("/Question", auth2_Question, async (req, res) => {
    try {
        // let data = fs.readFileSync(path.join(__dirname + '/app/public/views/questtion-details.html'), 'utf8', function (err, data) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     return data;
        // });
        const post = await Post.find({ postid: req.query.postid }, { _id: false, comments: { _id: false } });
        // var result = data.replace(/response.data/g, post);
        res.send(post);
        res.end();
    } catch (e) {
        res.status(400).send(e);
    }
});

// tag new question 
app.get("tag/Question", auth, async (req, res) => {
    try {
        let data = fs.readFileSync(path.join(__dirname + '/app/public/views/QuestionPage.html'), 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            return data;
        });
        const post = await Post.find({ postid: req.query.postid }, { _id: false, comments: { _id: false } });
        var result = data.replace(/response.data/g, post);
        res.send(result);
    } catch (e) {
        res.status(400).send(e);
    }
});//

app.post('/search',async(req,res)=>{
    const query = req.body.search;
    const words = query.split(' ');
    console.log(words);
})

// listening on port
app.listen(PORT, () => {
    console.log("server is running");
});