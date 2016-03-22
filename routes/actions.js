"use strict";
/* /actions */
const router  = require('express').Router();
const actions = require('./helper/api/actions');

// Handing `action` & `provider` & `id` Params
router.param('action', (req, res, next, action) => {
    req.olAction = action
    next()
})
router.param('provider', (req, res, next, provider) => {
    req.olProvider = provider
    next()
})
router.param('id', (req, res, next, id) => {
    req.olId = id
    next()
})

router.all('/:action/:provider/:id', (req, res, next) => {
    let provider = req.olProvider;

    q_userFindOne({ id: provider + req.olPassports[provider] })
    .then(found => {
        return actions[provider](req.olAction, {
            token      : found.token,
            tokenSecret: found.tokenSecret,
            id         : req.olId,
            params     : req.body.params,
            method     : req.method.toLowerCase(),
            query      : req.query
        })
    })
    .then(data => res.json(data))
    .fail(err => next(err))
})

module.exports = router