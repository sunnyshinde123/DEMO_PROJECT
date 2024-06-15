const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner}=require("../middlewares/middleware.js");
const Listing=require("../models/listing.js");
const {index, newListing, showListing, createListing, editListing, updateListing, deleteListing}=require("../controllers/listing.js");
const multer = require('multer');
const { storage, cloudinary } = require('../CloudConfig.js'); 
const upload = multer({ storage: storage });


const router=express.Router();


//Home Route
// router.get("/", (req, res)=>{
//     res.send("Welcome to the Server");
// })

//index Route
router.get("/", wrapAsync(index));

//New Route
router.get("/new",isLoggedIn, newListing);

//Show Route
router.get("/:id", wrapAsync(showListing))

//Create Route
router.post("/", isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(createListing));


//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

//Update Route
router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

//delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports=router;