const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middlewares/middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");


const router=express.Router({mergeParams:true});

//Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
    let {id}=req.params;
    let {rating, comment}=req.body;
    let listing=await Listing.findById(id);
    let reviews=new Review({
        rating:rating,
        comment:comment
    })
    reviews.author=req.user._id;
    let result=listing.reviews.push(reviews);
    await reviews.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);
}))

//delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor,wrapAsync(async(req, res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Review Deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports=router;