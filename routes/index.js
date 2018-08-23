var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//landing page (root) route
router.get("/", function(req, res){
    res.render("home")
});

//sign up form route
router.get("/register", function(req, res) {
    res.render("./authentication/register.ejs");
});

//sign up handler
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome To YelpCamp: " + req.user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//login form route
router.get("/login", function(req, res){
   res.render("./authentication/login.ejs"); 
});

//login handler route
router.post("/login", function(req,res,next) {
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Welcome to YelpCamp: " + req.body.username,
        failureFlash: true
    })(req, res);
});


//logout handler
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/campgrounds");
});


module.exports = router;