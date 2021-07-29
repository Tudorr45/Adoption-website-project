var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Message = require("../models/message");
var Conversation = require("../models/conversation");
var crypto = require('crypto');

const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


const mongoURI = "mongodb://localhost/adoption_db";
const conn = mongoose.createConnection(mongoURI);
let gfs;
conn.once('open', () => {
    //init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err){
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({storage});

//main profile route
router.get("/:id", function (req, res) {
    User.findById(req.params.id).populate("pets").exec(function (err, user) {
        if(err){
            console.log(err);
        } else {
            res.render("profile/index", {currentUser: res.locals.currentUser, user: user});
        }
    });
});

//inbox route
router.get("/:id/inbox", isLoggedIn, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err){
            console.log(err);
        } else {
            Conversation.find({speakers: {$all: [user]}}).populate("speakers").exec( function (err, conversations) {
                if(err){
                    console.log(err);
                } else {
                    res.render("profile/inbox", {user: user, conversations: conversations});
                }
            });
        }
    });
});

//conversation route
router.get("/:loggedUserId/inbox/:conversationId", isLoggedIn, function (req, res) {
    User.findById(req.params.loggedUserId, function (err, user) {
        if(err){
            console.log(err);
        } else {
            Conversation.find({speakers: {$all: [user]}}).populate("speakers").exec( function (err, conversations) {
                if (err) {
                    console.log(err);
                } else {
                        Conversation.findById(req.params.conversationId).populate("speakers").populate("messages").exec(function (err, foundConversation) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(foundConversation);
                                res.render("profile/conversation", {
                                    user: user,
                                    conversations: conversations,
                                    selectedConversation: foundConversation
                                });
                            }
                        });
                }
            })
        }
    });
});

//user posts route
router.get("/:id/posts", function (req, res) {
    User.findById(req.params.id).populate("pets").exec(function (err, user) {
        if(err){
            console.log(err);
        } else {
            res.render("profile/posts", {currentUser: res.locals.currentUser, user: user});
        }
    });
});

//edit user route
router.get("/:id/edit", function (req, res) {
    User.findById(req.params.id).populate("pets").exec(function (err, user) {
        if(err){
            console.log(err);
        } else {
            res.render("profile/edit", {user: user});
        }
    });
});

//update user route
router.put("/:id", upload.single('file'), function(req, res) {
    req.body.user.isAssociation = req.body.user.isAssociation === "association";
    try {
        req.body.user.photo = req.file.filename;
    } catch (e) {
        console.log("filename not selected. The photo remains the same.");
    }
    User.findByIdAndUpdate(req.params.id, req.body.user,function (err, updatedUser) {
        if(err) {
            console.log(err);
            res.redirect("/profile/" + req.params.id);
        } else {
            console.log(updatedUser);
            res.redirect("/profile/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;