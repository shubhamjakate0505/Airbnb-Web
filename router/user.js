const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const user = require("../models/user.js");
const Wrapasync = require("../utility/Wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")

const usersControllers=require("../controllers/users.js")
//const wrapAsync = require("../utils/wrapAsync");
//const passport = require("passport");
//const {saveRedirectUrl}=require("../middleware.js")
//const usersControllers=require("../controllers/users.js")

router.route("/singup")
.get(usersControllers.randersingup)
.post(Wrapasync(usersControllers.singup))

router.route("/login")
.get(usersControllers.randerloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usersControllers.login)


/* .get(usersControllers.renderSignupForm)
.post(wrapAsync(usersControllers.singup))


router.route("/login")
.get(usersControllers.renderLoginFrom)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),
usersControllers.login
)




router.get("/logout",usersControllers.logout) */

router.get("/logout",usersControllers.logout)

module.exports=router;