"use strict";
const express      = require('express');
const app          = express();
const res_time     = require('response-time');
const favicon      = require('serve-favicon');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');
const morgan       = require('morgan');
const helmet       = require('helmet');
const passport     = require('passport');
const compress     = require('compression');
const limiter      = require('connect-ratelimit');


// global variables
global.Q = require('q')
global.User = require('./models/ol').User;
global.q_userFindOne = Q.nbind(User.findOne, User)
global.q_userFindOneAndRemove = Q.nbind(User.findOneAndRemove, User)

// load dotenv
require('dotenv').load()

// Authentication strategies
require('./strategies/strategies')(passport)

// Connect to DB
const DB_URI = (
    process.env.MONGODB
        ? JSON.parse(process.env.MONGODB).uri
    : 'mongodb://test:test@localhost:27017/test'
);
mongoose.connect(DB_URI);
mongoose.connection
.on('err', (err) => console.error(err))
.once('open', () => console.log('Connected to MongoDB'))


// App Settings
app.set('trust proxy', true)

// Middlewares
app
.use(limiter({ end: true }))
.use(compress())
.use(bodyParser.json({ limit: 5120000 }))
.use(cookieParser())
.use(session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
}))
.use(passport.initialize())
.use(res_time())
.use(favicon(__dirname + '/public/img/favicon.ico'))
.use(morgan(':remote-addr [:date[clf]] :method :url', {
    immediate: true,
    skip: (req, res) => /\/auth\/\w+\/callback/.test(req.originalUrl)
}))
.use(helmet())
.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
.use(helmet.csp({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["*", "data:", "blob:"],
        mediaSrc: ["*"],
    },
    setAllHeaders: false,
    disableAndroid: false,
}))
.use(helmet.xssFilter())
.use(helmet.frameguard('deny'))
.use(helmet.hsts({
    maxAge: 10886400000,
    includeSubdomains: true,
    preload: true
}))
.use([
    '/timeline',
    '/actions',
    '/auth/revoke',
    '/auth/replicant/deckard',
    '/upload',
], require('./middlewares/protectEndpoints'));


// Template engines
app
.set('views', './views')
.set('view engine', 'jade')

// Routing
app
.use('/auth', require('./routes/auth'))
.use('/timeline', require('./routes/timeline'))
.use('/actions', require('./routes/actions'))
.use('/upload', require('./routes/upload'))
.use('/share', require('./routes/share'))
.use('/public', express.static('public'))
.all('/*', (req, res, next) => res.sendFile(__dirname + '/index.html'))


// Handing Error
app.use((err, req, res, next) => {
    console.log(err, err.stack)

    let statusCode = err.statusCode || 500;
    let errObj = Object.prototype.toString.call(err) === '[object Object]'
                    ? err
                : { statusCode: statusCode };

    res.status(statusCode).json(errObj)
})


app.listen(process.env.PORT || 3000)