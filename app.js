const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('./config/config')
const ConnectMongo = require('connect-mongo')(session)
const mongoose = require('mongoose').connect(config.dburl)
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const port = 8080
const env = process.env.NODE_ENV || 'development'
const axios = require('axios')

// Routers
const topRouter = express.Router()
const tripsRouter = express.Router({mergeParams: true})
const skyScannerRouter = express.Router()

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
// app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))

// DB
// Mongoose models (should abstract out soon)
const UserModel = require('./database/models/userSchema')(mongoose)
const User = mongoose.model('User', UserModel)

const TripModel = require('./database/models/tripsSchema')(mongoose)
const Trip = mongoose.model('Trips', TripModel)
// DB

// Middleware
const middleware = require('./middleware/index')(express, cookieParser, app, tripsRouter, mongoose, ConnectMongo, passport, port, env, session, config)
// End Middleware

const server = require('http').Server(app)
const io = require('socket.io')(server)

// routes
require('./routes/routes')(express, app, topRouter, passport, config, User, Trip)
require('./routes/trips')(express, app, topRouter, mongoose, TripModel, Trip, User)
require('./routes/skyScanner')(express, app, skyScannerRouter, config)
// routes

// passport auth (FB)
require('./auth/passport/facebookStratgey')(passport, FacebookStrategy, config, mongoose, User)

// socket.io
require('./socket_io/socket')(io)

server.listen(app.get('port'), function () {
  console.log(`
    Listening on http://localhost:${port}
    Environment: ${env}
               `)
})
