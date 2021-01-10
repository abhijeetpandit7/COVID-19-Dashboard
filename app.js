const express = require('express');
const bodyParser = require('body-parser');
const app = express();      
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("index");
});

app.get("/state",function(req,res){
    res.render("stateDetail",{state:'Maharashtra', code:'MH'});
});

app.get("/wiki",function(req,res){
    res.render("wiki");
});

app.get("/:stateName",function(req,res){
    res.render("stateDetail",{state:req.params.stateName, code:req.query.button});
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server started");
})