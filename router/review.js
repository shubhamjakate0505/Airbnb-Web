const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utility/Wrapasync.js")
//const ExpressError=require("../utility/ExpressError.js");
const Listing=require("../models/Listing.js")
//const {listingSchema,reviewSchema}=require("../Schema.js")
const Review=require("../models/reviews.js")
const {validateReview, isLoggedIn,isReviewAuthr}=require("../middleware.js")

const ReviewController=require("../controllers/reviews.js")





// post Route
router.post("/",validateReview,isLoggedIn,wrapasync(ReviewController.Createreviews))
 
 router.delete("/:reviewId",isLoggedIn,isReviewAuthr,wrapasync(ReviewController.Destroy))
 

 module.exports=router;