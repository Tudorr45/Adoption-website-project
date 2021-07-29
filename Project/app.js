var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");
    app             = express();


var indexRoutes   = require("./routes/index"),
    petRoutes     = require("./routes/pets");
    profileRoutes = require("./routes/profile");
    messageRoutes = require("./routes/messages");

mongoose.connect("mongodb://localhost/adoption_db",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Configurarea Passport
app.use(require("express-session")({
  secret: "Secretul meu",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/pets", petRoutes);
app.use("/profile", profileRoutes);
app.use("/messages", messageRoutes);

app.listen(3000, function () {
  console.log("Adoption Server has started!");
});