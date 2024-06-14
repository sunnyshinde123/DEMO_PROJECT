const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirecturl} =require("../middlewares/middleware.js");

//singnUp Routes
router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup", wrapAsync(async(req, res)=>{
    try{
        let {username, email, password}=req.body;
    let user1=new User({
        username,
        email
    })
    let result=await User.register(user1, password)
    req.login(result, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", `Welcome @${username} to wanderlust`);
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

//login Routes

router.get("/login", (req, res)=>{
    res.render("user/login.ejs");
})

router.post("/login", saveRedirecturl, passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }), async(req, res)=>{
    req.flash("success", "Welcome back to wanderlust");
    let redirect=res.locals.redirectUrl || "/listings"
    res.redirect(redirect);
})

router.get("/logout", (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you logged out successfully!!!");
        res.redirect("/listings");
    })
})

module.exports=router;