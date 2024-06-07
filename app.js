const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");

const app=express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate);

main().then(res => console.log("DB Connected Successfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb")
}

const port=9020;

//Home Route
app.get("/", (req, res)=>{
    res.send("Welcome to the Server");
})

//index Route
app.get("/listings", (req, res)=>{
    Listing.find({}).then(result => res.render("listing/index.ejs", {result})).catch(err=> res.send(err));
})

//New Route
app.get("/listings/new", (req, res)=>{
    res.render("listing/new.ejs");
})

//Show Route
app.get("/listings/:id", (req, res)=>{
    let {id}=req.params;
    Listing.findById(id).then(result => res.render("listing/show.ejs", {result})).catch(err => res.send(err));

})

//Create Route
app.post("/listings", wrapAsync((req, res)=>{
    let {listing}=req.body;
    let newListing=new Listing(listing);
    newListing.save().then(result => console.log(result));
    res.redirect("/listings");
}));
// app.post("/listings", wrapAsync((req, res)=>{
//     let {listing}=req.body;
//     let newListing=new Listing(listing);
//     newListing.save().then(result => console.log(result)).catch(err => res.send(err));
//     res.redirect("/listings");
// }));

//Edit Route 
app.get("/listings/:id/edit", (req, res)=>{
    let {id}=req.params;
    Listing.findById(id).then(result => res.render("listing/edit.ejs",{result})).catch(err => res.send(err));
})

//Update Route
app.patch("/listings/:id", (req, res)=>{
    let {id}=req.params;
    let {listing}=req.body;
    Listing.findByIdAndUpdate(id, listing, {new:true, runValidators:true}).then(result => res.redirect("/listings")).catch(err => res.send(err));
})

//delete Route
app.delete("/listings/:id", (req, res)=>{
    let {id}=req.params;
    Listing.findByIdAndDelete(id, {new:true}).then(result => res.redirect("/listings")).catch(err => res.send(err));
})

app.use((err, req, res, next)=>{
    console.log("***************************");
    res.send("Something went wrong!");
})

app.listen(port, ()=>{
    console.log(`listent to the port of ${port}`);
})

