var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    User            = require("./models/user");

var commentRoutes       = require("./routes/comments"),
    sneakerRoutes    = require("./routes/sneakers"),
    indexRoutes         = require("./routes/index");
    

var url = process.env.DATABASEURL || "mongodb://localhost:27017/hoop_camp";
//mongoDB config
mongoose.connect(url, {useNewUrlParser: true});

//APP config

//post request body parser setup
app.use(bodyParser.urlencoded({extended: true}));

//ejs view engine setup
app.set("view engine", "ejs");

//set /public as root directory
app.use(express.static(__dirname + "/public"));

//configure method override
app.use(methodOverride("_method"));

//setup connect flash
app.use(flash());

//passport config
app.use(require("express-session")({
    secret: "key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//setup middleware to pass req.user to res templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//setup routes
app.use(indexRoutes);
app.use("/sneakers/:id/comments", commentRoutes);
app.use("/sneakers", sneakerRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server started!"); 
});



// RESTFUL ROUTES
// name     url      verb    description
// ================================================
// index   /dogs      get     display list of dogs from DB
// new     /dogs/new  get     display form to add new dogs and triggers POST
// create  /dogs      post    add new dog to DB
// show    /dogs/:id  get     show info about one dog