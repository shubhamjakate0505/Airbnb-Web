const User=require("../models/user.js");
module.exports.randersingup=(req,res)=>{
    res.render("users/singup.ejs")
}




module.exports.singup=async(req,res)=>{
    try{
        let {username,email,password}=req.body
        const newUser=new User({email,username})
        const registerUser=await User.register(newUser,password)
        console.log(registerUser)
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","New User is created")
            res.redirect("/listings")
        })
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/singup")
    }
  
}

module.exports.randerloginform=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcomme back")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)

}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are Logged out Now")
        res.redirect("/listings")
    })
}