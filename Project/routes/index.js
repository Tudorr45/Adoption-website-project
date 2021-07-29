var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Pet = require("../models/pets");
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

//main page
router.get("/", function (req, res) {
  Pet.find({saved: true}, function (err, adoptedPets) {
      if(err){
          console.log(err);
      } else {
          var pets = adoptedPets.reverse();
          res.render("landing", {pets: pets});
      }
  });
});

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle register form
router.post("/register", upload.single('file'), function (req, res) {
    User.countDocuments({"username": req.body.username}, function (err, number) {
        if(err){
            console.log(err);
            res.render("register");
        } else {
            if(number === 0){
                var isAssociation;
                isAssociation = req.body.isAssociation === "association";
                var newUser = new User(
                    {
                        username: req.body.username,
                        name: req.body.name,
                        phone: req.body.phone,
                        photo: req.file.filename,
                        county: req.body.county,
                        city: req.body.city,
                        isAssociation: isAssociation
                    });
                User.register(newUser, req.body.password, function (err, user) {
                    if(err){
                        console.log(err);
                        return res.render("register");
                    }
                    passport.authenticate("local")(req, res, function () {
                        res.redirect("/pets?page=1&limit=12");
                    });
                });
            } else {
                console.log("User already exists...");
                res.render("register");
            }
        }
    });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handle login form
router.post("/login", passport.authenticate("local",
    {
      successRedirect: "/pets?page=1&limit=12",
      failureRedirect: "/login"
    }),function (req, res) {
});

//logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/pets?page=1&limit=12");
});

router.get("/donations", function (req, res) {
    res.render("donations");
});

module.exports = router;