const Twit  = require('twit');

module.exports = ({ minId, maxId, token, tokenSecret, count }) => {
    const T = new Twit({
        consumer_key       : process.env.TWITTER_KEY,
        consumer_secret    : process.env.TWITTER_SECRET,
        access_token       : token,
        access_token_secret: tokenSecret,
    });
    const promiseTwit = Q.nbind(T.get, T);
    const tOpts = Object.assign({
        include_entities: false,
        count           : count || 100,
    }, (
        minId
            ? { since_id: minId }
        : maxId
            ? { max_id: maxId }
        : {}
    ));

    return promiseTwit('statuses/home_timeline', tOpts)
    .then((data) => {
        if (maxId) {
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
