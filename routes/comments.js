var express = require("express");
var router = express.Router({mergeParams: true});
var Sneaker = require("../models/sneaker");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //same as ../middleware/index.js

//Comments new route
router.get("/new", middleware.checkLoggedIn, function(req, res) {
    
    Sneaker.findById(req.params.id, function(err, foundSneaker){
        if(err)
            console.lof(err);
        else{
            res.render("./comments/new.ejs", {foundSneaker: foundSneaker});
        }
    });
});

//Comments create handler route
router.post("/", middleware.checkLoggedIn, function(req, res){
    
    var sneakerId = req.params.id
    
     Comment.create(req.body.comment, function(err, newComment){
        if (err)
            console.log(err);
        else{
            Sneaker.findById(sneakerId, function(err, foundSneaker) {
                if(err)
                    console.log(err);
                else{
                    //add username and id to comment
                   
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    
                    foundSneaker.comments.push(newComment);
                    foundSneaker.save();
                    
                    req.flash("success", "Comment Created");
                    res.redirect("/sneakers/"+sneakerId);
                }
            });
        }
     });           
   
});

//Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err)
                console.log(err);
            else{
                res.render("./comments/edit.ejs", {foundComment: foundComment, sneakerId: req.params.id});
            }
        });
});

//Update comment handler route
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Comment updated");
            res.redirect("/sneakers/" + req.params.id);
        }
    })
});

//Delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err)
            console.log(err);
        else{
            req.flash("success", "Comment Deleted");
            res.redirect("/sneakers/" + req.params.id);
        }
    })
})

module.exports = router;