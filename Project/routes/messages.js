var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Message = require("../models/message");
var Conversation = require("../models/conversation");

//create a message
router.get("/new/:id", isLoggedIn, function(req, res){
    User.findById(req.params.id, function (err, user) {
        if(err){
            console.log(err);
        } else {
            res.render("messages/newMessage", {user: user})
        }
    })
});

//message creation
router.post("/:id", isLoggedIn, function (req, res) {
    //lookup user using ID
    User.findById(req.params.id, function (err, user) {
        if(err){
            console.log(err);
            res.redirect("/pets?page=1&limit=12");
        } else {
            Message.create({
                author: req.user.name, receiver: user.name, text: req.body.message.text}, function (err, message) {
                if(err){
                    console.log(err);
                } else {
                    //add username and ID to message
                    message.author.id = req.user._id;
                    message.author.name = req.user.name;
                    message.receiver.id = user._id;
                    message.receiver.name = user.name;
                    var currentTime = new Date();
                    message.time = currentTime.getHours() + ":" + currentTime.getMinutes();
                    message.save();
                    var found = false;
                    console.log("Mesaj creat: \n" + message);
                    Conversation.find({speakers: {$all: [req.user, user]}},function (err, conversations) {
                        if(err){
                            console.log(err);
                            res.redirect("/");
                        } else {
                            try {
                                conversations.forEach(function (conversation){
                                    conversation.messages.push(message);
                                    conversation.save();
                                    found = true;
                                    res.redirect("/profile/" + res.locals.currentUser.id + "/inbox/" + conversation.id);
                                });
                                if(found === false) {
                                    Conversation.create({speakers: [], messages: []}, function (err, newConversation) {
                                        if (err) {
                                            console.log("Eroare la create: \n" + err);
                                        } else {
                                            newConversation.speakers.push(req.user);
                                            newConversation.speakers.push(user);
                                            newConversation.messages.push(message);
                                            newConversation.save();
                                            console.log("Conversatia nou creata: \n" + newConversation);
                                            res.redirect("/profile/" + res.locals.currentUser.id + "/inbox/" + newConversation.id);
                                        }
                                    });
                                }
                            } catch(err) {
                                console.log("Eroare la push: \n" + err);
                            }
                        }
                    });
                }
            });
        }
    })
});

//reply
router.post("/:id/reply/:conversationId", isLoggedIn, function (req, res) {
    //lookup user using ID
    User.findById(req.params.id, function (err, user) {
        if(err){
            console.log(err);
            res.redirect("/pets?page=1&limit=12");
        } else {
            Message.create({
                author: req.user.name, receiver: user.name, text: req.body.message.text}, function (err, message) {
                if(err){
                    console.log(err);
                } else {
                    //add username and ID to message
                    message.author.id = req.user._id;
                    message.author.name = req.user.name;
                    message.receiver.id = user._id;
                    message.receiver.name = user.name;
                    var currentTime = new Date();
                    message.time = currentTime.getHours() + ":" + currentTime.getMinutes();
                    message.save();
                    Conversation.findById(req.params.conversationId,function (err, conversation) {
                        if(err){
                            console.log(err);
                        } else {
                            try {
                                conversation.messages.push(message);
                                conversation.save();
                                res.redirect("/profile/"+ req.params.id + "/inbox/" + req.params.conversationId);
                            } catch(err) {
                                console.log("Eroare la push: \n" + err);
                            }
                        }
                    });
                }
            });
        }
    })
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;