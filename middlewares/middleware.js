const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.validateListing=(req, res, next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let mesg=error.details.map(ele => ele.message).join(",")
        throw new ExpressError(400, mesg);
    }else{
        next();
    }
}

module.exports.validateReview=(req, res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMesg=error.details.map(ele=> ele.message).join(",")
        throw new ExpressError(400, errMesg);
    }else{
        next();
    }
}

module.exports.isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must logged in to the page");
        return res.redirect("/login");
    }else{
        next();
    }
}

module.exports.isOwner=async(req, res, next)=>{
    let {id}=req.params;
    let result = await Listing.findById(id);
    if(!result.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.saveRedirecturl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthor=async(req, res, next)=>{
    let {id, reviewId}=req.params;
    let result = await Review.findById(reviewId);
    if(!result.author.equals(req.user._id)){
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}