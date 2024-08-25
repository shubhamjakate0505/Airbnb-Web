const express=require("express");
const router=express.Router();
const wrapasync=require("../utility/Wrapasync.js")
//const {listingSchema,reviewSchema}=require("../Schema.js")
//const ExpressError=require("../utility/ExpressError.js");
const Listing=require("../models/Listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const ListingContoller=require("../controllers/listings.js")
const multer=require('multer')
const {storage}=require("../clodeConfig.js")
const upload=multer({storage})

router.route("/")
.get(wrapasync(ListingContoller.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapasync(ListingContoller.createListing))

//New Route

router.get("/new",isLoggedIn,ListingContoller.randerNewform)

router.route("/:id")
.get(wrapasync(ListingContoller.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapasync(ListingContoller.updatesListing))
.delete(isLoggedIn,isOwner,wrapasync(ListingContoller.deleteListing))




// Create Route


//update
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(ListingContoller.renderEditForm))








module.exports=router;