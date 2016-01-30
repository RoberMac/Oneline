"use strict";
/* /share */
const router = require('express').Router();

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
const Share = require('../models/ol').Share;
const q_shareFindOne = Q.nbind(Share.findOne, Share);
router.post('/:provider/:id', (req, res, next) => {
    const id = req.olProvider + req.olId;
    const sharer = req.body.sharer;
    let post = Object.assign(req.body.post, { detail: true });

    if (post.quote) { post.quote.detail = true }

    // Assign shared date to `sharer`
    Object.assign(sharer, { shared_at: Date.now() });

    q_shareFindOne({ id  })
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

    q_shareFindOne({ id })
    .then(found => {
        if (found) {
            Object.assign(found, { viewCount: found.viewCount + 1 })
                found.save(err => {
                    if (err) { 
                        next({ statusCode: 500 })
                    } else {
                        res.render('share', {
                            sharedData: found
                        })
                    }
                })
        } else {
            res.redirect('/settings')
        }
    }, err => next({ statusCode: 500 }))
})

module.exports = router