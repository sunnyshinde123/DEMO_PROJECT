const User=require("../models/user.js");

module.exports.signUp=(req, res)=>{
    res.render("user/signup.ejs");
}

module.exports.createUser=async(req, res)=>{
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
}

module.exports.loginUser=(req, res)=>{
    res.render("user/login.ejs");
}

module.exports.loggedIn=async(req, res)=>{
    req.flash("success", "Welcome back to wanderlust");
    let redirect=res.locals.redirectUrl || "/listings"
    res.redirect(redirect);
}

module.exports.logOutUser=(req, res, next)=>{
    req.logOut ((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you logged out successfully!!!");
        res.redirect("/listings");
    })
}