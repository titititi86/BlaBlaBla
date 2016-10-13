var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
//var cookieSession = require('cookie-session');


global.appRoot = path.resolve(path.join(__dirname, ".."));


var config = require("./config/config.js");
var User = require("./models/user.js");

var routes = require('./routes/index');

mongoose.connect(config.db.mongodb);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/views", express.static(path.join(appRoot, "client", "views")));
app.use(express.static(path.join(appRoot, "client", "public")));


app.use(expressSession({
    secret: 'heyLauraTuVasbien',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).end(JSON.stringify({message: "Not Found"}));
});

// error handlers
app.use(function(err, req, res) {
    res.status(err.status || 500);
    
    res.end(JSON.stringify({
	message: err.message
    }));
});

module.exports = app;
