const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirecturl} =require("../middlewares/middleware.js");
const {signUp, createUser, loginUser, loggedIn, logOutUser}=require("../controllers/user.js");

//singnUp Routes
router.get("/signup", signUp);

router.post("/signup", wrapAsync(createUser));

//login Routes

router.get("/login", loginUser);

router.post("/login", saveRedirecturl, passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }), loggedIn);

//logout Routes

router.get("/logout", logOutUser);

module.exports=router;