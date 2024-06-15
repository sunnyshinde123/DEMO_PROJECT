const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middlewares/middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const {createReview, deleteReview}=require("../controllers/review.js");


const router=express.Router({mergeParams:true});

//Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview))

//delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor,wrapAsync(deleteReview));


module.exports=router;