/* eslint no-else-return: 0 */

'use strict';
/* /actions */
const router  = require('express').Router();
const Auth    = require('./helper/api/auth');
const Actions = require('./helper/api/actions');

// Handing `action` & `provider` & `id` Params
router.param('action', (req, res, next, action) => {
    req.olAction = action;
    next();
});
router.param('provider', (req, res, next, provider) => {
    req.olProvider = provider;
    next();
});
router.param('id', (req, res, next, id) => {
    req.olId = id;
    next();
});

router.all('/:action/:provider/:id', (req, res, next) => {
    const provider = req.olProvider;
    const id = provider + req.olPassports[provider];
    const actionOpts = {
        id    : req.olId,
        params: req.body.params,
        method: req.method.toLowerCase(),
        query : req.query,
    };

    q_userFindOne({ id })
    .then(found => {
        Object.assign(actionOpts, {
            token       : found.token,
            tokenSecret : found.tokenSecret,
            refreshToken: found.refreshToken,
        });

        return Actions[provider](req.olAction, actionOpts);
    })
    .fail(err => {
        const isTokenExpired = /expired?/i.test(err.msg);

        if (isTokenExpired) {
            // Try to refresh token and re-request
            return (
                Auth[provider].refreshToken(actionOpts.refreshToken)
                .then(updateToken)
                .then(reRequest)
            );
        } else {
            throw err;
        }
    })
    .then(data => res.json(data))
    .fail(err => next(err));


    function updateToken(data) {
        const update = {
            token       : data.access_token,
            refreshToken: data.refresh_token,
        };

        Object.assign(actionOpts, update);

        return q_userFindOneAndUpdate({ id }, update);
    }
    function reRequest() {
        return Actions[provider](req.olAction, actionOpts);
    }
});

module.exports = router;
