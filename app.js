const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('./config/config.js')
const ConnectMongo = require('connect-mongo')(session)
const mongoose = require('mongoose').connect(config.dburl)
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 8080
const env = process.env.NODE_ENV || 'development'

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose)
require('./routes/routes.js')(express, app, passport, config)
require('./socket/socket.js')(io)

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('morgan')('combined'))

if (env === 'development') {
  // dev specific settings
  app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
  }))
} else {
  // production specific settings
  app.use(session({
    secret: config.sessionSecret,
    store: new ConnectMongo({
      url: config.dburl,
      mongooseConnection: mongoose.connection,
      stringify: true
    })
  }))
}// endelse

app.use(passport.initialize())
app.use(passport.session())

app.set('port', process.env.PORT || port)
server.listen(app.get('port'), function () {
  console.log(`
    Listening on http://localhost:${port}
    Environment: ${env}
               `)
})
