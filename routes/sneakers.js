var express = require("express");
var router = express.Router();
var Sneaker = require("../models/sneaker");
var middleware = require("../middleware"); //same as ../middleware/index.js

//INDEX route
router.get("/", function(req, res){
    //get all sneakers from DB
    Sneaker.find({}, function(err, foundSneakers){
        if(err){
            console.log(err);
        }else{
            res.render("./sneakers/index.ejs" , {foundSneakers:foundSneakers});
        }
    });
});

//New route
router.get("/new", middleware.checkLoggedIn, function(req, res){
    res.render("./sneakers/new.ejs");
});

//Create route
router.post("/", middleware.checkLoggedIn,function(req, res){
    
    console.log(req.body);
    //create and store info into DB
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    Sneaker.create({
        name: req.body.name,
        img: req.body.img,
        description: req.body.description,
        price: req.body.price,
        review: req.body.review,
        author: author
    }, function(err, newSneaker){
        if(err)
            req.flash("error", "Cannot Create Sneaker");
        else{
            req.flash("success", "Sneaker Created!");
             //redirect back to index page with updated information
            res.redirect("/sneakers");
        }
    })
});

//Show route
router.get("/:id", function(req, res) {
    Sneaker.findById(req.params.id).populate("comments").exec(function(err, foundSneaker){
        if(err){
            console.log(err);
        }
        else{
            //render show template of specific sneaker
            res.render("./sneakers/show.ejs", {foundSneaker: foundSneaker});
        }
    });
});

//edit route - show edit form
router.get("/:id/edit", middleware.checkSneakerOwnership, function(req, res) {
    
    Sneaker.findById(req.params.id, function(err, foundSneaker){
        if(err)
            req.flash("error", "Cannot edit Sneaker");
        else{
            res.render("./sneakers/edit.ejs", {foundSneaker: foundSneaker});
        }
    });
});

//update route - edit handler
router.put("/:id", middleware.checkSneakerOwnership, function(req, res){
    Sneaker.findByIdAndUpdate(req.params.id, req.body.sneaker ,function(err, updatedSneaker){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Sneaker Updated");
            res.redirect("/sneakers/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.checkSneakerOwnership ,function(req, res){
    Sneaker.findByIdAndRemove(req.params.id, function(err){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Sneaker Deleted");
            res.redirect("/sneakers");
        }
    });
});

module.exports = router;