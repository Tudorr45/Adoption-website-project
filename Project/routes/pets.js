var express = require("express");
var router = express.Router();
var Pet = require("../models/pets");
var User = require("../models/user");
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

//main pet route
router.get("/", paginatedResults(Pet), function (req, res) {
    var pets = res.paginatedResults;
    var page = parseInt(req.query.page);
    Pet.countDocuments({"saved": false},function(err, number){
        if(err){
            console.log(err);
        } else {
            res.render("pets/index", {pets: pets, limit: 12, page: page, nrOfPets: number});
        }
    });
});

//Edit pet route
router.get("/:id/edit", checkPetOwnership,  function (req, res) {
    Pet.findById(req.params.id, function (err, foundPet) {
        if(err){
            console.log(err);
        } else{
            User.findById(foundPet.author.id, function (err, foundUser) {
                if(err){
                    console.log(err);
                } else {
                    res.render("pets/edit", {pet: foundPet, author: foundUser});
                }
            });
        }
    });
});

//Update pet route
router.put("/:id", checkPetOwnership, upload.single('file'), function(req, res) {
    req.body.pet.saved = req.body.isSaved === "saved";
    req.body.pet.hasShelter = req.body.pet.hasShelter === "Cu adapost";
    try {
        req.body.pet.image = req.file.filename;
    } catch (e) {
        console.log("filename not selected. The photo remains the same.");
    }
    Pet.findByIdAndUpdate(req.params.id, req.body.pet, function (err, updatedPet) {
        if(err) {
            console.log(err);
            res.redirect("/pets");
        } else {
            res.redirect("/pets/" + req.params.id);
        }
    });
});

//destroy pet route
router.delete("/:id", checkPetOwnership, function (req, res) {
    Pet.findByIdAndRemove(req.params.id, function (err, foundPet) {
        if(err){
            res.redirect("/pets");
        } else {
            //User.updateOne({'_id': res.locals.currentUser._id},{$pull: {"pets": foundPet}});
            res.redirect("/pets?page=1&limit=12");
        }
    })
});

//add a pet route
router.post("/", upload.single('file'), function(req, res){
    var newPet = {
        name: req.body.name,
        description: req.body.description,
        species: req.body.species,
        maturity: req.body.maturity,
        size: req.body.size,
        gender: req.body.gender,
        color: req.body.color,
        hasShelter: req.body.shelter === "Cu adapost",
        image: req.file.filename,
        saved: false,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Pet.create(newPet, function (err, newlyCreated) {
        if(err){
            console.log(err);
        } else {
            User.findById(res.locals.currentUser._id, function (err, currentUser) {
                if (err) {
                    console.log(err);
                    res.redirect("/pets?page=1&limit=12");
                } else {
                    currentUser.pets.push(newlyCreated);
                    currentUser.save();
                }
            });
            console.log(newlyCreated);
            res.redirect("/pets?page=1&limit=12");
        }
    });
});

//images route
app.get('/image/:filename', (req, res) => {
   gfs.files.findOne({filename: req.params.filename }, (err, file) => {
      //check if file
       if(!file || file.length === 0){
           return res.status(404).json({
               err: 'No file exists'
           });
       }
       //check if image
       if(file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
           //read output to browser
           const readstream = gfs.createReadStream(file.filename);
           readstream.pipe(res);
       } else {
           res.status(404).json({
               err: 'Not an image'
           });
       }
   });
});

//render new pet form
router.get("/new", isLoggedIn, function (req, res) {
    res.render("pets/newPet");
});

//show a specific pet route
router.get("/:id", function (req, res) {
    Pet.findById(req.params.id).populate("author").exec(function (err, foundPet) {
        if(err){
            console.log(err);
        } else {
            User.findById(foundPet.author.id, function (err, foundUser) {
                if(err){
                    console.log(err);
                } else {
                    res.render("pets/show", {pet: foundPet, author: foundUser});
                }
            });
            //res.render("pets/show", {pet: foundPet});
        }
    });
});

//check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//check if the logged user owns a specific pet
function checkPetOwnership(req, res, next){
    if(req.isAuthenticated()){
        Pet.findById(req.params.id, function (err, pet) {
            if (err) {
                res.redirect("/pets?page=1&limit=12");
            } else {
                console.log(pet);
                //does user own the pet?
                if (pet.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        try {
            results.results = await model.find({"saved": false}).limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch(e) {
            res.status(500).json({ message: e.message});
        }
    };
}

module.exports = router;