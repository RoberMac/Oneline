'use strict';
/* /auth */
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const router   = require('express').Router();

// Handing `provider` Params
router.param('provider', (req, res, next, provider) => {
    const validProviders = ['twitter', 'instagram', 'weibo', 'unsplash'];

    if (validProviders.indexOf(provider) >= 0) {
        req.olProvider = provider;
        next();
    } else {
        next({ statusCode: 400, msg: 'invalid provider' });
    }
});

/**
 * Auth
 *
 */
router.get('/:provider', (req, res, next) => {
    const authOpts = { session: false };
    switch (req.olProvider) {
        case 'unsplash':
            Object.assign(authOpts, { scope: ['public', 'read_photos', 'write_likes'] });
            break;
        default:
            break;
    }

    passport.authenticate(req.olProvider, authOpts)(req, res, next);
});
router.get('/:provider/callback', (req, res, next) => {
    passport.authenticate(req.olProvider, { session: false })(req, res, next);
}, (req, res) => {
    const user        = req.user;
    const provider    = user.provider;
    const uid         = user.uid;
    const name        = user.name;
    const screen_name = user.screen_name;
    const avatar      = user.avatar;
    const token = jwt.sign({
        provider,
        uid,
    }, process.env.KEY, {
        expiresIn: provider === 'weibo' ? '7d' : '14d',
    });

    res.render('authCallback', {
        token,
        provider,
        profile: {
            uid,
            name,
            avatar,
            screen_name,
            provider,
        },
    });
});


/**
 * Revoke
 *
 */
router.delete('/revoke/:provider', (req, res, next) => {
    const provider = req.olProvider;
    const id       = provider + req.olPassports[provider];

    q_userFindOneAndRemove({ id })
    .then(() => res.json({ statusCode: 200 }))
    .fail(err => next(err));
});


/**
 * Replicant
 *
 */
const crypto = require('crypto');
const Replicant = require('../utils/models').Replicant;
const q_replicantFindOne = Q.nbind(Replicant.findOne, Replicant);

router.post('/replicant/deckard', (req, res, next) => {
    const code = (
        crypto
        .createHash('md5')
        .update(JSON.stringify(req.olPassports) + Date.now())
        .digest('hex')
        .slice(0, 7)
    );

    q_replicantFindOne({ id: code })
    .then(found => {
        if (!found) {
            const replicant = new Replicant({
                id       : code,
                token    : JSON.stringify(req.olTokenList),
                profile  : JSON.stringify(req.body.profileList),
                createdAt: new Date(),
            });
            replicant.save(err => {
                if (err) return next({ statusCode: 500 });
                res.json({ code });
            });
        } else {
            next({ statusCode: 400, msg: 'code is existed' });
        }
    }, err => next({ statusCode: 500 }));
});
router.get('/replicant/rachael', (req, res, next) => {
    q_replicantFindOne({ id: req.query.code })
    .then(found => {
        if (found) {
            res.json({
                tokenList  : JSON.parse(found.token || '[]'),
                profileList: JSON.parse(found.profile || '[]'),
                msg        : JSON.parse(found.msg || '[]'),
            });
        } else {
            next({ statusCode: 404 });
        }
    }, err => next({ statusCode: 500 }));
});

module.exports = router;
