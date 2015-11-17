"use strict";
/* /auth */
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const router   = require('express').Router();

// Handing `provider` Params
router.param('provider', (req, res, next, provider) => {
    let providerList = ['twitter', 'instagram', 'weibo'];

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
router.get('/:provider', (req, res, next) => {
    passport.authenticate(req.olProvider, { session: false })(req, res, next)
})
router.get('/:provider/callback', (req, res, next) => {
    passport.authenticate(req.olProvider, {
        session: false
    })(req, res, next)
}, (req, res) => {

    let token = jwt.sign({
        'provider': req.user.provider,
        'userId'  : req.user.userId
    }, process.env.KEY, {
        expiresIn: req.user.provider === 'weibo' ? '7d' : '14d'
    });

    res.render('authCallback', {
        provider: req.olProvider,
        token: token,
        profile: {
            uid        : req.user.userId,
            name       : req.user.name,
            avatar     : req.user.avatar,
            screen_name: req.user.screen_name,
            _provider  : req.olProvider
        }
    })
})


/**
 * Revoke
 *
 */
router.delete('/revoke/:provider', (req, res, next) => {
    let provider = req.olProvider;
    let id       = provider + req.olPassports[provider];

    q_userFindOneAndRemove({id: id})
    .then(() => res.json({statusCode: 200}))
    .fail(err => next(err))
})


/**
 * Replicant
 *
 */
let crypto = require('crypto');

router.get('/replicant/deckard', (req, res, next) => {
    let passports = req.olPassports;
    let code = crypto.createHash('md5')
                .update(JSON.stringify(passports) + Date.now())
                .digest('hex').slice(0, 7);
    let tokenList = req.headers.authorization && JSON.parse(req.headers.authorization.split(' ')[1]) || [];

    // 保存於數據庫
    q_replicantFindOne({ id: code })
    .then(found => {
        if (found){
            found.id = code
            found.token = JSON.stringify(tokenList)
            found.token = req.query.profileList
            found.createdAt = new Date()
            found.save(err => {
                if (err) return next({ statusCode: 500 })
                res.json({ statusCode: 200, code: code })
            })
        } else {
            let replicant = new Replicant({
                id       : code,
                token    : JSON.stringify(tokenList),
                profile  : req.query.profileList,
                createdAt: new Date()
            });
            replicant.save(err => {
                if (err) return next({ statusCode: 500 })
                res.json({ statusCode: 200, code: code })
            })
        }
    }, err => next({ statusCode: 500 }))
})
router.post('/replicant/rachael', (req, res, next) => {

    // 保存於數據庫
    q_replicantFindOne({ id: req.body.code })
    .then(found => {
        if (found){
            res.json({
                statusCode: 200,
                tokenList: JSON.parse(found.token || '[]'),
                profileList: JSON.parse(found.profile || '[]'),
                msg: JSON.parse(found.msg || '[]')
            })
        } else {
            next({ statusCode: 404 })
        }
    }, err => next({ statusCode: 500 }))
})

module.exports = router