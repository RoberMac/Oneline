// local variables
var express      = require('express'),
    app          = express(),
    res_time     = require('response-time'),
    favicon      = require('serve-favicon'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    cookieParser = require('cookie-parser'),
    mongoose     = require('mongoose'),
    morgan       = require('morgan'),
    helmet       = require('helmet'),
    passport     = require('passport'),
    compress     = require('compression');

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
var db_uri = process.env.MONGODB
    ? JSON.parse(process.env.MONGODB).uri
    : 'mongodb://test:test@localhost:27017/test'


// Connect to DB
mongoose.connect(db_uri);

var db = mongoose.connection
.on('err', function (err){
    console.error(err)
})
.once('open', function (){
    console.log('Connected to MongoDB')
})


// App Settings
app.set('trust proxy', true)


// Middleware
app.use(compress())
app.use(bodyParser.json({ limit: 5120000 }))
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(res_time())
app.use(favicon(__dirname + '/public/img/favicon.ico'))
app.use(morgan(':remote-addr [:date[clf]] :method :url', {
    immediate: true,
    skip: function (req, res){
        return /\/auth\/\w+\/callback/.test(req.originalUrl)
    }
}))
app.use(helmet())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))
app.use(helmet.contentSecurityPolicy({
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
app.set('views', './views')
app.set('view engine', 'jade')


// 保護 endpoints
var jwt = require('jsonwebtoken');
app.use(['/timeline', '/actions', '/auth/revoke', '/auth/replicant', '/upload'], function (req, res, next){
    var tokenList = req.headers.authorization && JSON.parse(req.headers.authorization.split(' ')[1]) || [],
        validPassports = {},
        invalidToken = [];

    // 提取有效 token 的 payload 到 req.olPassports
    tokenList.forEach(function (token, index){
        try {
            var decoded = jwt.verify(token, process.env.KEY)
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
app.use('/auth', require('./routes/auth'))
app.use('/timeline', require('./routes/timeline'))
app.use('/actions', require('./routes/actions'))
app.use('/upload', require('./routes/upload'))
app.use('/public', express.static('public'))
app.all('/*', function (req, res, next){
    res.sendFile(__dirname + '/views/index.min.html')
})


// Handing Error
app.use(function (err, req, res, next){
    console.log(err, err.stack)

    var statusCode = err.statusCode || 500,
        errObj     = Object.prototype.toString.call(err) === '[object Object]'
                        ? err
                        : { statusCode: statusCode }

    res.status(statusCode).json(errObj)

})


app.listen(process.env.PORT || 3000)