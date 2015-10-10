var extend  = require('extend'),
    Twit    = require('twit'),
    Ig      = require('instagram-node').instagram(),
    request = require('request'),
    filter  = require('./filter');

module.exports = {
    twitter: function (action, opts){

        var T = new Twit({
            consumer_key       : process.env.TWITTER_KEY,
            consumer_secret    : process.env.TWITTER_SECRET,
            access_token       : opts.token,
            access_token_secret: opts.tokenSecret
        });
        var q_twit = Q.nbind(T.post, T);

        // Init
        var tOpts = {}, action_str;

        switch (action){
            case 'like':
                action_str = 'favorites/' + (opts.method === 'put' ? 'create' : 'destroy')
                extend(tOpts, { id: opts.id, include_entities: false })
                break;
            case 'retweet':
                action_str = 'statuses/' + ((opts.method === 'put' || opts.method === 'post')
                                                ? 'retweet'
                                                : 'destroy')
                extend(tOpts, { id: opts.id, trim_user: true })
                break;
            case 'reply':
                extend(tOpts, { in_reply_to_status_id: opts.id })
            case 'quote':
            case 'tweet':
                action_str = 'statuses/update'
                extend(tOpts, {
                    status: opts.params.status,
                    media_ids: opts.params.media_ids,
                    trim_user: true
                })
                if (opts.params.geo){
                    extend(tOpts, {
                        lat: opts.params.geo.lat,
                        long: opts.params.geo.long
                    })
                }
                break;
        }

        return q_twit(action_str, tOpts)
        .then(function (data){
            switch (action){
                case 'retweet':
                case 'quote':
                    return { statusCode: 200, id_str: data[0].id_str }
                    break;
                case 'like':
                case 'tweet':
                    return { statusCode: 200 }
                    break;
            }
        })
    },
    weibo: function (action, opts){

        var wOpts = { access_token: opts.token, id: opts.id }, action_str;

        switch (action){
            case 'like':
                action_str = 'attitudes/' + (opts.method === 'put' ? 'create' : 'destroy')
                break;
            case 'retweet':
                action_str = 'statuses/' + (opts.method === 'put' ? 'repost' : 'destroy')
                break;
            case 'star':
                action_str = 'favorites/' + (opts.method === 'put' ? 'create' : 'destroy')
                break;
        }

        var deferred = Q.defer();

        request.post({
            url: 'https://api.weibo.com/2/' + action_str + '.json', 
            form: wOpts
        }, function (err, res, body){
            if (err || res.statusCode !== 200){
                deferred.reject(err || { statusCode: res.statusCode })
            } else {

                var data;
                try {
                    data = JSON.parse(body)
                } catch (e) {
                    data = body
                } finally {
                    deferred.resolve({ statusCode: 200, id_str: data.idstr })
                }
            }
        })

        return deferred.promise;
    },
    instagram: function (action, opts){
        Ig.use({ access_token : opts.token })
        var q_ig;

        switch (action){
            case 'like':
                q_ig = Q.nbind(Ig.likes, Ig);
                break;
            case 'reply':
                q_ig = Q.nbind(Ig.comments, Ig);
                break;
        }

        if (action === 'user'){
            return Q.all([
                Q.nbind(Ig.user, Ig)(opts.id),
                Q.nbind(Ig.user_media_recent, Ig)(opts.id)
            ])
            .spread(function (userData, timelineData){
                var data = {
                    profile : userData[0],
                    timeline: filter.instagram(timelineData[0]).data
                };
                return {
                    statusCode: 200,
                    data: data
                }
            })
        } else {
            return q_ig(opts.id)
            .then(function (data){
                return { statusCode: 200, data: data[0].slice(0, 100) }
            })
        }
    }
}

