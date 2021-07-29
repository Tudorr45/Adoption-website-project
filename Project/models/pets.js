var mongoose = require("mongoose");

var petSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    species: String,
    maturity: String,
    size: String,
    gender: String,
    color: String,
    hasShelter: Boolean,
    saved: Boolean,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Pet", petSchema);