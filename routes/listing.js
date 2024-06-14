const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner}=require("../middlewares/middleware.js");
const Listing=require("../models/listing.js");

const router=express.Router();


//Home Route
// router.get("/", (req, res)=>{
//     res.send("Welcome to the Server");
// })

//index Route
router.get("/", wrapAsync(async(req, res)=>{
    let result=await Listing.find({});
    res.render("listing/index.ejs", {result})
}));

//New Route
router.get("/new",isLoggedIn, (req, res)=>{
    res.render("listing/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id}=req.params;
    let result= await Listing.findById(id).populate({path:"reviews", populate:{
        path:"author"
    }}).populate("owner");
    if(!result){
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", {result})

}))

//Create Route
router.post("/", isLoggedIn, wrapAsync(async (req, res, next)=>{
    let {listing}=req.body;
    let newListing=new Listing(listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save()
    req.flash("success", "New Listing Successfully Created");
    res.redirect("/listings");
}));


//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id}=req.params;
    let result = await Listing.findById(id);
    if(!result){
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{result})
}));

//Update Route
router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res)=>{
    let {id}=req.params;
    let {listing}=req.body;
    if(!listing){
        throw new ExpressError(400, "Bad Request");
    }
    await Listing.findByIdAndUpdate(id, listing, {new:true, runValidators:true});
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}));

//delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id, {new:true});
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings")
}));

module.exports=router;