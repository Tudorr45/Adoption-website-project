var mongoose = require("mongoose");
var Pet = require("./models/pets");
var Conversation = require("./models/conversation");
var Message = require("./models/message");
var User = require("./models/user");

var data = [
    {
        name: "Mr.Furr",
        image: "https://timesofindia.indiatimes.com/thumb/msid-76940605,width-1200,height-900,resizemode-4/.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Cat",
        saved: "false"
    },
    {
        name: "Aares",
        image: "https://media.nature.com/lw800/magazine-assets/d41586-020-01430-5/d41586-020-01430-5_17977552.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Dog",
        saved: "false"
    },
    {
        name: "Rex",
        image: "https://www.dogstrust.org.uk/help-advice/_images/164742v800_puppy-1.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Dog",
        saved: "false"
    },
    {
        name: "Teddy",
        image: "https://www.cesarsway.com/wp-content/uploads/2019/10/AdobeStock_190562703.jpeg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Dog",
        saved: "false"
    },
    {
        name: "Tim",
        image: "https://i.natgeofe.com/n/867b88cb-b464-4a53-897b-11528bb5d669/01-cat-names-nationalgeographic_1525054.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Cat",
        saved: "false"
    },
    {
        name: "Tom",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/66/An_up-close_picture_of_a_curious_male_domestic_shorthair_tabby_cat.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Cat",
        saved: "true"
    },
    {
        name: "Max",
        image: "https://cdn.cnn.com/cnnnext/dam/assets/201030094143-stock-rhodesian-ridgeback-large-169.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Dog",
        saved: "false"
    },
    {
        name: "Tyson",
        image: "https://i.natgeofe.com/n/187b3223-0b45-4aa5-ae5c-24793dd2d6cb/01-german-shepherd-coronavirus-bwtkdt.jpg?w=1200",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        species: "Dog",
        saved: "true"
    }
];

function seedDB() {
    // Conversation.remove({}, function (err) {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log("Toate conversatiile au fost sterse");
    //     }
    // });
    // Message.remove({}, function (err) {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log("Toate mesajele au fost sterse");
    //     }
    // });
    // User.remove({}, function (err) {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log("Toti userii au fost stersi");
    //     }
    // });
    // //Remove all pets
    // Pet.remove({}, function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("removed pets!");
            //add a few pets
            // data.forEach(function (seed) {
            //     Pet.create(seed, function (err, pet) {
            //         if(err){
            //             console.log(err);
            //         } else{
            //             console.log("Added a pet");
            //         }
            //     });
            // });
    //     }
    // });
}

module.exports = seedDB;