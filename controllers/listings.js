const Listing=require("../models/Listing")

module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});

}
module.exports.randerNewform=(req,res)=>{
    
    res.render("listings/new.ejs")
}

module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("Owner");
    if(!listing){
        req.flash("error","Listing Does not Exit");
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing=async(req,res,next)=>{
let url=req.file.path;
let filename=req.file.path    
const newListing=new Listing(req.body.listing)
newListing.Owner=req.user._id;
newListing.image={url,filename}
await newListing.save()

req.flash("success","New Listing is Created")
// console.log(listing)
res.redirect("/listings")


}


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing Does not Exit");
        res.redirect("/listings")
    }
    let orignalImageurl=listing.image.url;
    orignalImageurl=orignalImageurl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,orignalImageurl})
    }

    module.exports.updatesListing=async(req,res)=>{

        let {id}=req.params;
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

        if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.path   
        listing.image={url,filename}
        await listing.save();
    }
        req.flash("success","Listing is Updated")
        res.redirect(`/listings/${id}`)
        
        }

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing is Deleted")
    res.redirect("/listings");
    }