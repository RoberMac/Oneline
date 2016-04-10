'use strict';
const Ig = require('instagram-node').instagram();

module.exports = opts => {
    Ig.use({ access_token: opts.token });

    const q_ig_timeline = Q.nbind(Ig.user_self_feed, Ig);
    const iOpts = Object.assign({
        count: opts.count || 100,
    }, (
        opts.minId
            ? { min_id: opts.minId }
        : opts.maxId
            ? { max_id: opts.maxId }
        : {}
    ));

    return q_ig_timeline(iOpts);
};
