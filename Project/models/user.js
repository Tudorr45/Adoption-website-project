mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    phone: String,
    photo: String,
    county: String,
    city: String,
    isAssociation: Boolean,
    website: String,
    facebook: String,
    instagram: String,
    pets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);