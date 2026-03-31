require('dotenv').config()
const mongoose = require('mongoose');
const initdata=require("./data");
const Listing=require("../models/Listing.js");
const { required } = require('joi');

const URL_DATA=process.env.MONGO_URL;
main().then((res)=>{
    console.log("Connected to db");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect(URL_DATA);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,Owner:'66c8c56dc2bd9d75e59042bb'}))
    await Listing.insertMany(initdata.data);
    console.log("Data was initialised");

}
initDB();