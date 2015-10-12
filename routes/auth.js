/* /auth */
var passport = require('passport'),
    jwt      = require('jsonwebtoken'),
    router   = require('express').Router();

// Handing `provider` Params
router.param('provider', function (req, res, next, provider){
    var providerList = ['twitter', 'instagram', 'weibo'];

    if (providerList.indexOf(provider) >= 0){
        req.olProvider = provider
        next()
    } else {
        next({ statusCode: 400, msg: 'bad syntax' })
    }
})

/**
 * Auth
 *
 */
router.get('/:provider', function (req, res, next){
    passport.authenticate(req.olProvider, { session: false })(req, res, next)
})
router.get('/:provider/callback', function (req, res, next){
    passport.authenticate(req.olProvider, {
        session: false
    })(req, res, next)
}, function (req, res){

    var token = jwt.sign({
        'provider': req.user.provider,
        'userId'  : req.user.userId
    }, process.env.KEY, {
        expiresInMinutes: 60 * 24 * 7
    })

    res.render('authCallback', {
        provider: req.olProvider,
        token: token,
        profile: {
            displayName: req.user.displayName,
            avatar     : req.user.avatar,
            screen_name: req.user.screen_name
        }
    })
})


/**
 * Revoke
 *
 */
router.delete('/revoke/:provider', function (req, res, next){
    var provider = req.olProvider,
        id       = provider + req.olPassports[provider]

    q_userFindOneAndRemove({id: id})
    .then(function (){
        res.json({statusCode: 200})
    })
    .fail(function (err){
        next(err)
    })
})


/**
 * Replicant
 *
 */
var crypto = require('crypto');

router.get('/replicant/deckard', function (req, res, next){
    var passports = req.olPassports,
        code = crypto.createHash('md5')
                .update(JSON.stringify(passports) + Date.now())
                .digest('hex').slice(0, 7),
        tokenList = [];

    Object.keys(passports).forEach(function (provider){
        var token = jwt.sign({
            'provider': provider,
            'userId'  : passports[provider]
        }, process.env.KEY, {
            expiresInMinutes: 60 * 24 * 7
        })

        tokenList.push(token)
    })

    // 保存於數據庫
    q_replicantFindOne({ id: code })
    .then(function (found){
        if (found){
            found.id = code
            found.token = JSON.stringify(tokenList)
            found.createdAt = new Date()
            found.save(function (err){
                if (err) return next({ statusCode: 500 })
                res.json({ statusCode: 200, code: code })
            })
        } else {
            var replicant = new Replicant({
                id       : code,
                token    : JSON.stringify(tokenList),
                createdAt: new Date()
            })
            replicant.save(function (err){
                if (err) return next({ statusCode: 500 })
                res.json({ statusCode: 200, code: code })
            })
        }
    }, function (err){
        next({ statusCode: 500 })
    })
})
router.post('/replicant/rachael', function (req, res, next){

    // 保存於數據庫
    q_replicantFindOne({ id: req.body.code })
    .then(function (found){
        if (found){
            res.json({
                statusCode: 200,
                tokenList: JSON.parse(found.token || '[]'),
                msg: JSON.parse(found.msg || '[]')
            })
        } else {
            next({ statusCode: 404 })
        }
    }, function (err){
        next({ statusCode: 500 })
    })
})

module.exports = router