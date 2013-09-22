var express = require('express');
var routes = require('./routes');

var http = require('http');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var conf = require("./config");

var app = express();

// all environments
app.set('views', './views');
app.set('view engine', 'hjs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('semi-secret-safeword! #1'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(id, done){
	done(null, id);
});


passport.use(new FacebookStrategy(conf.fbcreds, function(accessToken, refreshToken, profile, done){
	if(profile.emails[0].value == conf.mail){
		done(null, conf.secret)
	} else {
		done(null, false);
		console.log("failed to login", profile);
	}
}));

app.get('/', routes.index);
app.get('/_sys/auth/fb', passport.authenticate('facebook', { scope: 'email' }));
app.get('/_sys/auth/fb/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));
app.get(/\/_sys\/delete\/(.*)\/yes/, routes.remove_yes);
app.get('/_sys/delete/*', routes.remove);
app.post('/_sys/upload', routes.upload);
app.get('*', routes.index);

http.createServer(app).listen(80);
