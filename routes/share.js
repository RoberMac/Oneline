"use strict";
const router = require('express').Router();
const validator = require('is-my-json-valid');

const USER_SCHEMA = require('./helper/validator/userSchema');
const POST_SCHEMA = require('./helper/validator/postSchema');
const FORMATS = require('./helper/validator/formats');
const userValidate = validator(USER_SCHEMA, FORMATS);
const postValidate = validator(POST_SCHEMA, FORMATS);
const Share = require('../models/ol').Share;
const q_shareFindOne = Q.nbind(Share.findOne, Share);

router.param('provider', (req, res, next, provider) => {
    req.olProvider = provider
    next()
})
router.param('id', (req, res, next, id) => {
    req.olId = id
    next()
})

/**
 * Store Shared Post
 *
 */
router.post('/:provider/:id', require('../middlewares/protectEndpoints'), (req, res, next) => {
    if (!req.body.sharer || !req.body.post){
        next({ statusCode: 400, msg: 'sharer & post is required' })
        return;
    }

    const provider = req.olProvider;
    const id = provider + req.olId;
    const sharer = Object.assign(req.body.sharer, { shared_at: Date.now() });
    let post = Object.assign(req.body.post, { detail: true, avatarless: false });

    if (post.quote) { post.quote.detail = true }

    /**
     * Valid
     *
     */
    if (req.olPassports[provider] !== sharer.uid || !userValidate(sharer)) {
        next({ statusCode: 400, msg: 'invalid sharer' })
        return;
    }
    if (!postValidate(post)) {
        next({ statusCode: 400, msg: 'invalid post' })
        return;
    }

    q_shareFindOne({ id })
    .then(found => {
        if (found){
            // Update
            const newSharers = (
                found.sharers
                .filter(s => s.screen_name !== sharer.screen_name)
                .concat(sharer)
            );
            Object.assign(found, {
                sharers: newSharers,
                data: post
            })
            found.save(err => {
                if (err) { 
                    next({ statusCode: 500 })
                } else {
                    res.json({ id })
                }
            })
        } else {
            // Create
            const share = new Share({
                id,
                sharers: [sharer],
                viewCount: 0,
                data: post
            });
            share.save(err => {
                if (err) {
                    next({ statusCode: 500 })
                } else {
                    res.json({ id })
                }
            })
        }
    }, err => next({ statusCode: 500 }))
})

/**
 * Read Shared Post
 *
 */
router.get('/:provider/:id', (req, res, next) => {
    const id = req.olProvider + req.olId;
    const UA = req.headers['user-agent'].toLowerCase();
    const isAndroidWechat = /micromessenger/.test(UA) && /android/.test(UA);
    const render = sharedData => {
        if (isAndroidWechat) {
            res.render('accessDenied', {
                icon: 'androidWechat'
            })
        } else {
            res.render('share', {
                sharedData: {
                    sharers: sharedData.sharers,
                    data: sharedData.data,
                    viewCount: sharedData.viewCount
                },
                isBlocked: !!req.acceptsLanguages('zh', 'pa-pk', 'ko-kp', 'fa-ir')
            })
        }
    };

    q_shareFindOne({ id })
    .then(found => {
        if (found) {
            Object.assign(found, { viewCount: found.viewCount + 1 })
                found.save(err => {
                    if (err) { 
                        next({ statusCode: 500 })
                    } else {
                        render(found)
                    }
                })
        } else {
            res.redirect('/settings')
        }
    }, err => next({ statusCode: 500 }))
})

module.exports = router