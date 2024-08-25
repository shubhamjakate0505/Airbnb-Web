const Listing=require("./models/Listing")
const Review=require("./models/reviews")
const {listingSchema,reviewSchema}=require("./Schema.js")
const ExpressError=require("./utility/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to Create Post")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of the Listing")
        return res.redirect(`/listings/${id}`)
    }
    next()      
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    }else{
        next()
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errmsg)
    }else{
        next()
    }
}

module.exports.isReviewAuthr=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review ")
        return res.redirect(`/listings/${id}`)
    }
    next()      
}