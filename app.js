var express = require('express');
var swig = require('swig');
var lessMiddleware = require('less-middleware');
var routes = require('./routes');

var http = require('http');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var conf = require("./config");

var app = express();

// all environments
app.engine('swig', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'swig');
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

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

passport.deserializeUser(function(user, done){
	done(null, user);
    console.log(user)
});


passport.use(new FacebookStrategy(conf.fbcreds, function(accessToken, refreshToken, profile, done){
  var u = getUser(profile.emails[0].value);
  if(u){
		done(null, u)
	} else {
		done(null, false);
		console.log("failed to login", profile);
	}
}));

app.get('/', routes.index);
app.get('/_sys/auth/fb', passport.authenticate('facebook', { scope: 'email' }));
app.get('/_sys/auth/fb/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));
app.get('/_sys/do/delete/*', routes.remove_yes);
app.get('/_sys/delete/*', routes.remove);
app.post('/_sys/upload', routes.upload);
app.get('*', routes.index);

http.createServer(app).listen(conf.server.port);

var getUser = function(email){
  for (var i = 0; i < conf.user.length; i++) {
    if(conf.user[i].mail === email)
      return conf.user[i];
  };
}
