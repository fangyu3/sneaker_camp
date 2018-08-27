//all middleware goes here
var middlewareObj   = {};
var Sneaker      = require("../models/sneaker");
var Comment         = require("../models/comment");

middlewareObj.checkLoggedIn = function(req, res, next){
    
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In To Do That");           //show up on the next request, which is /login
        
    res.redirect("/login");
}

middlewareObj.checkSneakerOwnership = function(req, res, next){
    
    if(req.isAuthenticated())
    {
        Sneaker.findById(req.params.id, function(err, foundSneaker){
            if(err || !foundSneaker){
                req.flash("error", "Sneaker Not Found");
                res.redirect("back");
            }
            else{
                if(foundSneaker.author.id.equals(req.user._id)){
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