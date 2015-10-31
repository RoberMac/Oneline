/* /actions */
var router  = require('express').Router(),
    actions = require('./helper/actions');

// Handing `action` & `provider` & `id` Params
router.param('action', function (req, res, next, action){

    req.olAction = action

    next()
})
router.param('provider', function (req, res, next, provider){

    req.olProvider = provider

    next()
})
router.param('id', function (req, res, next, id){

    req.olId = id

    next()
})

router.all('/:action/:provider/:id', function (req, res, next){
    var provider = req.olProvider;

    q_userFindOne({ id: provider + req.olPassports[provider] })
    .then(function (found){

        return actions[provider](req.olAction, {

            token      : found.token,
            tokenSecret: found.tokenSecret,
            id         : req.olId,
            params     : req.body.params,
            method     : req.method.toLowerCase(),
            query      : req.query

        })
    })
    .then(function (data){
        res.json(data)
    })
    .fail(function (err){
        next(err)
    })
})

module.exports = router