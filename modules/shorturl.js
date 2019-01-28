let mongoose=require('mongoose');
let Schema=mongoose.Schema;

let urlSchema=new Schema({
    original_url:String,
    shorturl:Number
},{timestamps:true})//it is optional.

let ShortUrl=module.exports=mongoose.model("ShortUrl",urlSchema);
