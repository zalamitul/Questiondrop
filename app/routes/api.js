
const bcrypt = require('bcrypt');
const User = require('../models/login');

module.exports = (router)=>{
    router.post('/login', async (req, res) => {
        let user = new User();
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await bcrypt.hash(req.body.password, salt);
        const result = await user.save()
        console.log(result);
        res.send("user created")
    })
    return router;
}