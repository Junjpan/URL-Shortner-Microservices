var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var path=require('path');
var pug=require('pug');
var ShortUrl=require('./modules/shorturl');

mongoose.connect(process.env.Mongode_URI||'mongodb://localhost:27017/url');
let db=mongoose.connection;

//check connection
db.once("open",function(){
    console.log('connected to Mongodba')
  })
  
  // check for DB errros;
  db.on("error",function(err){
    console.log(err);
  })

 

var app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// load view engine
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","pug");

//set up the public folder
app.use(express.static(path.join(__dirname+'/public')))

app.get('/',(req,res)=>{
res.render('index');
});

app.post('/api/shorturl/new',(req,res)=>{
let url=req.body.url;
let regex=/^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/;
let shorturl=Math.floor(Math.random()*100000);
if (regex.test(url)){
    let url1=new ShortUrl({original_url:url,
            shorturl:shorturl});
    url1.save((err,data)=>{
        if (err){
          return  res.send("Error saving to database")
        }
    })
    res.json({'original_url':url,
              'shorturl':shorturl }) 
}else{
    res.json({"error":"invalid URL"})
}
})

//set up Shorturl get request
app.get('/api/shorturl/:number',(req,res)=>{
var short_url=Number(req.params.number);
ShortUrl.findOne({"shorturl":short_url},(err,data)=>{
if(err){res.send("Err reading database")}
else if(data){
    let re=new RegExp("^(http|https)://","i");
    let link=data.original_url;
    if(re.test(link)){
        res.redirect(link)
    }
    res.redirect("https://"+link);//redirect won't work if your link is like www.xxxx.com. you have to put https//or http// in front of www to make it work
} else{
    res.send("Not valid shorturl") 
}
})


})

/** this is another way to set your views with html files.
app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/views/index.pug')
})**/

var listener=app.listen(3000,()=>{
    console.log("Sever is starting on port 3000");
})
