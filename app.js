"use strict";
const express      = require('express');
const app          = express();
const res_time     = require('response-time');
const favicon      = require('serve-favicon');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');
const morgan       = require('morgan');
const helmet       = require('helmet');
const passport     = require('passport');
const compress     = require('compression');
const limiter      = require('connect-ratelimit');


// global variables
global.Q = require('q')
global.User = require('./models/ol').User
global.q_userFindOne = Q.nbind(User.findOne, User)
global.q_userFindOneAndRemove = Q.nbind(User.findOneAndRemove, User)
global.q_userFindOneAndUpdate = Q.nbind(User.findOneAndUpdate, User)
global.Replicant = require('./models/ol').Replicant
global.q_replicantFindOne = Q.nbind(Replicant.findOne, Replicant)

// load dotenv
require('dotenv').load()

// Authentication strategies
require('./strategies/strategies')(passport)


// read database config form VCAP_SERVICES env
const db_uri = process.env.MONGODB
    ? JSON.parse(process.env.MONGODB).uri
    : 'mongodb://test:test@localhost:27017/test'


// Connect to DB
mongoose.connect(db_uri);
mongoose.connection
.on('err', (err) => console.error(err))
.once('open', () => console.log('Connected to MongoDB'))


// App Settings
app.set('trust proxy', true)

// Middleware
app
.use(limiter({ end: true }))
.use(compress())
.use(bodyParser.json({ limit: 5120000 }))
.use(cookieParser())
.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
.use(passport.initialize())
.use(res_time())
.use(favicon(__dirname + '/public/img/favicon.ico'))
.use(morgan(':remote-addr [:date[clf]] :method :url', {
    immediate: true,
    skip: (req, res) => /\/auth\/\w+\/callback/.test(req.originalUrl)
}))
.use(helmet())
.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["*"],
    mediaSrc: ["*"],
    connectSrc: ['*'],
    reportOnly: false,
    setAllHeaders: false,
    disableAndroid: false,
    safari5: false
}));


// Template engines
app
.set('views', './views')
.set('view engine', 'jade')


// 保護 endpoints
const jwt = require('jsonwebtoken');
app.use([
    '/timeline',
    '/actions',
    '/auth/revoke',
    '/auth/replicant/deckard',
    '/upload'
], (req, res, next) => {
    let tokenList = req.headers.authorization && JSON.parse(req.headers.authorization.split(' ')[1]) || [];
    let validPassports = {};
    let invalidToken = [];

    // 提取有效 token 的 payload 到 req.olPassports
    tokenList.forEach((token, index) => {
        try {
            let decoded = jwt.verify(token, process.env.KEY);
            validPassports[decoded.provider] = decoded.userId
        } catch (e){
            try {
                invalidToken.push(jwt.decode(token).provider)
            } catch (e){
                invalidToken = ['twitter', 'instagram', 'weibo']
            }
        }
    })

    if (invalidToken.length > 0 || Object.keys(validPassports).length <= 0){
        next({ statusCode: 401, invalidToken: invalidToken})
    } else {
        req.olPassports = validPassports
        req.olId = {}
        next()
    }
})

// Routing
app
.use('/auth', require('./routes/auth'))
.use('/timeline', require('./routes/timeline'))
.use('/actions', require('./routes/actions'))
.use('/upload', require('./routes/upload'))
.use('/public', express.static('public'))
.all('/*', (req, res, next) => res.sendFile(__dirname + '/views/index.min.html'))


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