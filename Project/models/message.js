var mongoose = require("mongoose");

var MessageSchema = mongoose.Schema({
    text: String,
    time: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    receiver: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
});

module.exports = mongoose.model("Message", MessageSchema);