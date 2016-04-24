'use strict';

const Twit  = require('twit');

module.exports = opts => {
    const T = new Twit({
        consumer_key       : process.env.TWITTER_KEY,
        consumer_secret    : process.env.TWITTER_SECRET,
        access_token       : opts.token,
        access_token_secret: opts.tokenSecret,
    });
    const promiseTwit = Q.nbind(T.get, T);
    const tOpts = Object.assign({
        include_entities: false,
        count           : opts.count || 100,
    }, (
        opts.minId
            ? { since_id: opts.minId }
        : opts.maxId
            ? { max_id: opts.maxId }
        : {}
    ));

    return promiseTwit('statuses/home_timeline', tOpts)
    .then((data) => {
        if (opts.maxId) {
            data[0].splice(0, 1);
        }
        return data;
    }, err => {
        if (err.statusCode === 429) {
            return promiseTwit('application/rate_limit_status', { resources: ['statuses'] })
            .then((data) => {
                throw {
                    statusCode: 429,
                    message   : 'Rate limit exceeded',
                    reset     : data[0].resources.statuses['/statuses/home_timeline'].reset,
                };
            }, e => { throw e; });
        }
    });
};
