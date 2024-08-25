
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}




const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utility/ExpressError.js");
const session=require("express-session")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const port=8080;


const listingRouter=require("./router/listing.js");
const reviewRouter=require("./router/review.js")
const userRouter=require("./router/user.js")



const URL_DATA="mongodb://127.0.0.1:27017/Wanderlust";
main().then((res)=>{
    console.log("Connected to db");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect(URL_DATA);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))






const sessionOptions={
    secret:"apnacolleges",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }

}

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)
//Review 

app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Founds"))
})
app.use((err,req,res,next)=>{
    let {status=505,message="Something Went Worng"}=err;
    res.status(status).render("error.ejs",{message})
  
  

})
app.listen(port,()=>{
    console.log(`Listing on the port ${port}`);
})