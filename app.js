const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const app=express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

main().then(res => console.log("DB Connected Successfully"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb")
}

const port=9020;

app.get("/", (req, res)=>{
    res.send("Welcome to the Server");
})

app.listen(port, ()=>{
    console.log(`listent to the port of ${port}`);
})

