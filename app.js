var express = require('express'),
  app = express(),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  config = require('./config/config.js'),
  ConnectMongo = require('connect-mongo')(session),
  mongoose = require('mongoose').connect(config.dburl),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  rooms = [],
  port = 8080;

app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('jade'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({ extended: true }));


var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
  // dev specific settings
  app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
  }));
} else {
  // production specific settings
  app.use(session({
      secret: config.sessionSecret,
      store: new ConnectMongo({
          url: config.dburl,
          mongooseConnection: mongoose.connection,
          stringify: true
      })
  }));
}

/******************************************************

Writing data to mongolab

Define Structure of data
var userSchema = mongoose.Schema({
  username:String,
  password:String,
  fullName:String
});

Pass the model to mongoose

var Person = mongoose.model('users', userSchema);

Create a new {}
var John = new Person({
  username : 'john',
  password : 'password',
  fullName : 'john development'
});

Save to db with callback
John.save(function(){console.log('done')})

********************************************************/

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config, rooms);

app.set('port', process.env.PORT || port)
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function() {
  console.log('Listening on http://localhost:', port);
  console.log('mode: ' + env);
});

// befor socket.io
// app.listen(port, function() {
//   console.log('Listening on http://localhost:', port);
//   console.log('mode: ' + env);
// });
