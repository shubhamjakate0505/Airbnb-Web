const mongoose = require('mongoose');
const Review = require('./reviews');
const { types } = require('joi');
const Schema=mongoose.Schema;
//Strcture
const listingSchema=new Schema({
    title: {
        type: String,
        required: true,
      },
      description: String,
      image: {
       url:String,
       filename:String
      },
      price: Number,
      location: String,
      country: String,
      reviews:[
        {
          type:Schema.Types.ObjectId,
          ref:"Review"
        }
        
      ],
      Owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }

});
  listingSchema.post("findOneAndDelete",async(listing)=>{
    if(await Review.deleteMany({_id:{$in: listing.reviews}})){
      
    }
  })

//Modele
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
