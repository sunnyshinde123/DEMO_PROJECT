if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
console.log(process.env)
}
const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const review=require("./routes/review.js");
const user=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport = require("passport");
const LocalStartegy=require("passport-local");
const { isLoggedIn } = require("./middlewares/middleware.js");

const app=express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate);

const sessionOption={
    secret:"MySecretSuperstar",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 30 * 24 * 60 * 60 * 1000,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(res => console.log("DB Connected Successfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb")
}

const port=9020;
app.use((req, res, next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//Listing Route
app.use("/listings", listings);


//Review Route
app.use("/listings/:id/reviews", review);

//Authentication Route
app.use("/", user);

app.get("/demoUser", async(req, res)=>{
    const user1=new User({
        email:"sunnyshinde157@gmail.com",
        username:"Sunny Shinde"
    })
    let userLogIn=await User.register(user1, "sunnyshinde");
    res.send(userLogIn);
})

//random route
app.all("*", (req, res, next)=>{
    throw new ExpressError(404, "Page not found!!!");
    // next(new ExpressError(404, "Page not found!!!"));
})

//Error Handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Internal Server Error!!!"}=err;
    // console.log(err);
    res.status(statusCode).render("error.ejs", {message});
})


app.listen(port, ()=>{
    console.log(`listent to the port of ${port}`);
})

