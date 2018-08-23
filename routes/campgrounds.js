var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //same as ../middleware/index.js

//INDEX route
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("./campgrounds/index.ejs" , {campgrounds:campgrounds});
        }
    });
});

//New route
router.get("/new", middleware.checkLoggedIn, function(req, res){
    res.render("./campgrounds/new.ejs");
});

//Create route
router.post("/", middleware.checkLoggedIn,function(req, res){
    //create and store info into DB
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    Campground.create({
        name: req.body.name,
        img: req.body.img,
        description: req.body.desc,
        author: author
    }, function(err, newCampground){
        if(err)
            req.flash("error", "Cannot Create Campground");
        else{
            req.flash("success", "Campground Created!");
             //redirect back to /campgrounds with updated information
            res.redirect("/campgrounds");
        }
    })
});

//Show route
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            //render show template of specific campground
            res.render("./campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});

//edit route - show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
            req.flash("error", "Cannot edit Campground");
        else{
            res.render("./campgrounds/edit.ejs", {foundCampground: foundCampground});
        }
    });
});

//update route - edit handler
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Campground Deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;