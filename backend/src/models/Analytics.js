const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({

 portfolioId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Portfolio"
 },

 ip:String,

 country:String,

 device:String,

 browser:String,

 referrer:String,

 sessionId:String,

 duration:Number,

 visitedAt:{
  type:Date,
  default:Date.now
 }

});

module.exports = mongoose.model("Analytics",analyticsSchema);