var express 				= require("express"),
 		app 						= express(),
		session					=require("express-session"),
		MongoStore			=require("connect-mongo")(session),
 		bodyParser 			= require("body-parser"),
	 	mongoose 				= require("mongoose"),
		flash						= require("connect-flash"),
		passport 				= require("passport"),
		LocalStrategy 	= require("passport-local"),
		methodOverride	= require("method-override"),
		Campground 			= require("./models/campground"),
		Comment 				= require("./models/comment"),
		User 						= require("./models/user"),
		seedDB 					= require("./seeds")

var port = process.env.PORT || 3000;

//requiring routes
var commentRoutes 		= require("./routes/comments"),	
		campgroundRoutes 	= require("./routes/campgrounds"),
		indexRoutes				= require("./routes/index")

mongoose.connect("mongodb+srv://eneda:<zjKb0y0dRVvz0fUF>@cluster0.jjrzk.mongodb.net/<yelp_camp>?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION

// app.use(require("express-session")({
// 	secret: "Once again Rusty wins cutest dog!",
// 	resave: false,
// 	saveUninitialized: false
// }));

app.use(session({
	secret:"yelper camper is a cool thing!",
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function(){
	console.log("YelpCamp is running port ${PORT}")
});