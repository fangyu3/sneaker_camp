var mongoose=require("mongoose");

//setup schema
var campgroundSchema = new mongoose.Schema({
   name: String,
   img: String,
   description: String,
   comments: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
   }],
   author:{ 
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
         },
      username: String
   }
});

//create db object 
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;