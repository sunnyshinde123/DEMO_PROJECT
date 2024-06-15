const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req, res)=>{
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
}

module.exports.deleteReview=async(req, res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Review Deleted");
    res.redirect(`/listings/${id}`);
}