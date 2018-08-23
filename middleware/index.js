//all middleware goes here
var middlewareObj   = {};
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");

middlewareObj.checkLoggedIn = function(req, res, next){
    
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In To Do That");           //show up on the next request, which is /login
        
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("Permission Denied");
                    res.redirect("back");
                }
            }
        });
    
    }else{
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment Not Found");
                res.redirect("back");
            }
            else{
                
                if(foundComment.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("Permission Denied");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
}

module.exports = middlewareObj;