//////////////
// requires //
//////////////
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var conf = require('./config/config');
var app = express();
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var router = express.Router();
require('mongoose-assert')(mongoose);
require('./config/passport')(passport);
var User = require('./models/user');

////////
// db //
////////
mongoose.connect(conf.dblink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("db connection established\n");
});

////////////
// config //
////////////
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
app.use(flash());
app.use(session({secret: "wholikescookies", cookie: { maxAge: 1000 * 60 * 5 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set("view engine","jade");
app.use(function(req,res,next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.user = req.user;
	next();
});
////////////
// routes //
////////////
require('./routes/index')(app,router,passport, User);

////////////
// server //
////////////
var server = app.listen(3000,function() {
		console.log("listening on port " + server.address().port + "\n");
});

