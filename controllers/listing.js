const Listing=require("../models/listing.js");

module.exports.index=async(req, res)=>{
    let result=await Listing.find({});
    res.render("listing/index.ejs", {result})
}

module.exports.newListing=(req, res)=>{
    res.render("listing/new.ejs");
}


module.exports.createListing=async (req, res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(req.file);
    let {listing}=req.body;
    let newListing=new Listing(listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    await newListing.save()
    req.flash("success", "New Listing Successfully Created");
    res.redirect("/listings");
}

module.exports.showListing=async(req, res)=>{
    let {id}=req.params;
    let result= await Listing.findById(id).populate({path:"reviews", populate:{
        path:"author"
    }}).populate("owner");
    if(!result){
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", {result})

}

module.exports.editListing=async(req, res)=>{
    let {id}=req.params;
    let result = await Listing.findById(id);
    if(!result){
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{result})
}

module.exports.updateListing=async(req, res)=>{
    let {id}=req.params;
    let {listing}=req.body;
    if(!listing){
        throw new ExpressError(400, "Bad Request");
    }
    await Listing.findByIdAndUpdate(id, listing, {new:true, runValidators:true});
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id, {new:true});
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings")
}
