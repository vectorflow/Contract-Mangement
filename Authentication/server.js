var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

// console.log(__dirname);

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname+'/views'));

app.get('/',
  function(req, res) {
    res.sendFile(__dirname+'/views/home.html');
  });

app.get('/login',
  function(req, res){
    res.sendFile('/login.html');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login.html' }),
  function(req, res) {
    res.redirect('/profile.html');
  });
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn("/error.html"),
  function(req, res){
    res.sendFile("/profile.html");
  });
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.listen(3000);