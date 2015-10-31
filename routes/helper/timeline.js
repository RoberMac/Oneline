var Twit    = require('twit'),
    Ig      = require('instagram-node').instagram(),
    Weibo   = require('./weibo');

module.exports = {
    twitter: function (opts){
        var T = new Twit({
            consumer_key       : process.env.TWITTER_KEY,
            consumer_secret    : process.env.TWITTER_SECRET,
            access_token       : opts.token,
            access_token_secret: opts.tokenSecret
        });
        var q_twit_get = Q.nbind(T.get, T);
        var tOpts = {
            include_entities: false,
            count: opts.count || 100
        };

        if (opts.min_id){
            tOpts.since_id = opts.min_id
        } else if (opts.max_id) {
            tOpts.max_id = opts.max_id
        }

        return q_twit_get('statuses/home_timeline', tOpts)
        .then(function (data){
            if (opts.max_id){
                data[0].splice(0, 1)
            }
            return data;
        }, function (err){
            if (err.statusCode === 429){
                return q_twit_get('application/rate_limit_status', { resources: ['statuses'] })
                .then(function (data){
                    throw {
                        statusCode: 429,
                        message: 'Rate limit exceeded',
                        reset: data[0].resources.statuses['/statuses/home_timeline'].reset
                    }
                }, function (err){
                    throw err
                })
            }
        })

    },
    instagram: function (opts){
        Ig.use({ access_token : opts.token })
        var q_ig_timeline   = Q.nbind(Ig.user_self_feed, Ig);

        var iOpts = {
            count: opts.count || 100
        };

        if (opts.min_id){
            iOpts.min_id = opts.min_id
        } else if (opts.max_id){
            iOpts.max_id = opts.max_id
        }

        return q_ig_timeline(iOpts)
    },
    weibo: function (opts){
        var wOpts = {
            access_token: opts.token,
            count: opts.count || 100
        };

        if (opts.min_id){
            wOpts.since_id = opts.min_id
        } else if (opts.max_id) {
            wOpts.max_id = opts.max_id
        }

        return Weibo({
            method: 'get',
            endpoint: 'statuses/home_timeline',
            opts: wOpts
        })
        .then(function (data){
            if (opts.max_id){
                data['statuses'].splice(0, 1)
            }
            return data;
        })
    }
}


