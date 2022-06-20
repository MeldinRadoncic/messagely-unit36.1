

//  * Make sure to update their last-login!
 


 const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY, BCRYPT_WORK_FACTOR} = require("../config");
const ExpressError = require("../expressError");
const { authenticate } = require("../models/user");


/** POST /login - login: {username, password} => {token}**/

router.post('/login',async(req,res,next) => {
   try {
    let {username,password} = req.body;
    if(await authenticate(username,password)) {
        const token = jwt.sign({username},SECRET_KEY)
        User.updateLoginTimestamp(username);
       return res.json({message:`Successfully Logged In}, token`},200) 
    }

   } catch(e) {
    return next(e)
   }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!**/

router.post('/register', async(req,res,next) => {
    try{
    let {username} = await User.register(req.body)
    let token = jwt.sign({username}, SECRET_KEY)
    User.updateLoginTimestamp(username);
    return res.json({message:'Successfully Registered!',token},200)
    } catch(e) {
        return next(e)
    }
})

module.exports = router