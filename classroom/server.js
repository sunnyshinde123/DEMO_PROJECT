const express=require("express");
const cookieParser=require("cookie-parser");

const app=express();
const port=9020;

app.use(cookieParser("secreatCode"));

app.get("/sendcookies", (req, res)=>{
    res.cookie("greet", "Sunny", {signed:true});
    res.send("Welcome to the Cookies");
})

app.get("/getcookies", (req, res)=>{
    console.dir(req.signedCookies);
    res.send(`get cookies by`);
})


app.listen(port, ()=>{
    console.log("Listen to the port");
})