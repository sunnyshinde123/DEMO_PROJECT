const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./init.js");

main().then(res => console.log("DB Connected Successfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb")
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((ele)=> {
        return {...ele, owner:'666bebede706dece1de7ded5'}
    })
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

// async function initDB(){
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("Data Was Initialized");
// }

initDB();


