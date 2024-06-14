const express=require("express");
const express_session=require("express-session");

const app=express();
const port=9030;

app.use(express_session({
    secret:"secretCode",
    resave:false,
    saveUninitialized:true
}))


app.get("/requestcout", (req, res)=>{
    if(req.session.count){
        req.session.count+=1;
    }else{
        req.session.count=1;
    }
    console.log(req.session);
    res.send(`you requested to server ${req.session.count} times`);
})



app.listen(port, ()=>{
    console.log("Listen to the port");
})
