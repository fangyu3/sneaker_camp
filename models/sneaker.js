var mongoose=require("mongoose");

//setup schema
var sneakerSchema = new mongoose.Schema({
   name: String,
   img: String,
   description: String,
   price: String,
   review: {
      style: String,
      cushion: String,
      traction: String,
      fitting: String
   },
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
var Sneaker = mongoose.model("Sneaker", sneakerSchema);

module.exports = Sneaker;