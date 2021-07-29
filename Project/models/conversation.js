var mongoose = require("mongoose");

var ConversationSchema = mongoose.Schema({
    speakers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

module.exports = mongoose.model("Conversation", ConversationSchema);
