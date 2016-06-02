const passport = require('passport');
const jwt      = require('jsonwebtoken');
const router   = require('express').Router();

// Handing `provider` Params
router.param('provider', (req, res, next, provider) => {
    const validProviders = ['twitter', 'instagram', 'weibo', 'unsplash'];

    if (provider === 'instagram') {
        res.redirect('http://developers.instagram.com/post/145262544121/instagram-platform-update-effective-june-1-2016');
        return;
    }

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
    const { provider, uid, name, screen_name, avatar } = req.user;
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

    promiseUserFindOneAndRemove({ id })
    .then(() => res.json({ statusCode: 200 }))
    .fail(err => next(err));
});


/**
 * Replicant
 *
 */
const crypto = require('crypto');
const Replicant = require('../utils/models').Replicant;
const promiseReplicantFindOne = Q.nbind(Replicant.findOne, Replicant);
const userValidate = require('./helper/schema/helpers/user');

router.post('/replicant/deckard', (req, res, next) => {
    const profileList = req.body.profileList;
    const code = (
        crypto
        .createHash('md5')
        .update(JSON.stringify(req.olPassports) + Date.now())
        .digest('hex')
        .slice(0, 7)
    );
    const invalidProfileList = (
        profileList.some(profile => {
            if (userValidate.validate(profile).error) {
                next({ statusCode: 400, msg: 'invalid profile' });
                return true;
            }
            return false;
        })
    );

    if (invalidProfileList) return;

    promiseReplicantFindOne({ id: code })
    .then(found => {
        if (!found) {
            const replicant = new Replicant({
                id       : code,
                token    : JSON.stringify(req.olTokenList),
                profile  : JSON.stringify(profileList),
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
    promiseReplicantFindOne({ id: req.query.code })
    .then(found => {
        if (found) {
            const { token, profile, msg } = found;
            res.json({
                tokenList  : JSON.parse(token || '[]'),
                profileList: JSON.parse(profile || '[]'),
                msg        : JSON.parse(msg || '[]'),
            });
        } else {
            next({ statusCode: 404 });
        }
    }, err => next({ statusCode: 500 }));
});

module.exports = router;
