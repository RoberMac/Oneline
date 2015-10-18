var extend  = require('extend'),
    Twit    = require('twit'),
    Ig      = require('instagram-node').instagram(),
    Weibo   = require('./weibo'),
    timelineFilter = require('./filter--timeline'),
    profileFilter = require('./filter--profile');

module.exports = {
    twitter: function (action, opts){

        var T = new Twit({
            consumer_key       : process.env.TWITTER_KEY,
            consumer_secret    : process.env.TWITTER_SECRET,
            access_token       : opts.token,
            access_token_secret: opts.tokenSecret
        });

        // Init
        var tOpts  = {},
            _GET   = opts.method === 'get',
            q_twit = Q.nbind(T[_GET ? 'get' : 'post'], T),
            action_str;

        if (action === 'user'){
            return Q.all([
                q_twit('users/show', { user_id: opts.id, include_entities: false }),
                q_twit('statuses/user_timeline', {
                    user_id: opts.id,
                    count: 7,
                    trim_user: false,
                    exclude_replies: false,
                    contributor_details: false,
                    include_rts: true
                })
            ])
            .spread(function (userData, timelineData){
                var data = profileFilter.twitter.user(userData[0]);

                extend(data, { timeline: timelineFilter.twitter(timelineData[0]).data })

                return { data: data }
            })
        } else {

            switch (action){
                case 'like':
                    action_str = 'favorites/' + (opts.method === 'put' ? 'create' : 'destroy')
                    extend(tOpts, { id: opts.id, include_entities: false })
                    break;
                case 'retweet':
                    action_str = 'statuses/' + (/put|post/.test(opts.method)
                                                    ? 'retweet'
                                                : _GET
                                                    ? 'retweets'
                                                : 'destroy')
                    extend(tOpts, {
                        id: opts.id,
                        trim_user: _GET ? false : true,
                        count: 50
                    })
                    break;
                case 'reply':
                    extend(tOpts, { in_reply_to_status_id: opts.id })
                case 'quote':
                case 'tweet':
                    action_str = 'statuses/update'
                    extend(tOpts, {
                        status: opts.params.status,
                        media_ids: opts.params.media_ids,
                        trim_user: true,
                        possibly_sensitive: opts.params.sensitive
                    })
                    if (opts.params.geo){
                        extend(tOpts, {
                            lat: opts.params.geo.lat,
                            long: opts.params.geo.long
                        })
                    }
                    break;
                case 'follow':
                    action_str = 'friendships/' + (opts.method === 'put' ? 'create' : 'destroy')
                    extend(tOpts, { id: opts.id })
                    break;
                default:
                    throw { statusCode: 404 };
                    break;
            }

            return q_twit(action_str, tOpts)
            .then(function (data){
                if (_GET){
                    switch (action){
                        case 'retweet':
                        case 'reply':
                            return { data: profileFilter.twitter[action](data[0]) }
                            break;
                    }
                } else {
                    switch (action){
                        case 'retweet':
                        case 'quote':
                            return { id_str: data[0].id_str }
                            break;
                        case 'like':
                        case 'tweet':
                        case 'reply':
                        case 'follow':
                            return { statusCode: 200 }
                            break;
                    }
                }
            })
        }
    },
    weibo: function (action, opts){

        // Init
        var wOpts  = { access_token: opts.token, id: opts.id },
            _GET   = opts.method === 'get',
            action_str;

        switch (action){
            case 'like':
                action_str = 'attitudes/' + (opts.method === 'put' ? 'create' : 'destroy')
                break;
            case 'star':
                action_str = 'favorites/' + (opts.method === 'put' ? 'create' : 'destroy')
                break;
            case 'quote':
            case 'retweet':
                action_str = 'statuses/' + (/put|post|get/.test(opts.method)
                                                ? 'repost'
                                            : 'destroy')
                extend(wOpts, {
                    status: opts.params && opts.params.status // `destroy` 時無 `opts.params` 
                })
                break;
            case 'reply':
                action_str = _GET ? 'comments/show' : 'comments/create'
                _GET ? null : extend(wOpts, { comment: opts.params.status })
                break;
            case 'tweet':
                action_str = 'statuses/update'
                extend(wOpts, { status: opts.params.status })
                if (opts.params.geo){
                    extend(wOpts, {
                        lat: opts.params.geo.lat,
                        long: opts.params.geo.long
                    })
                }
                break;
            default:
                throw { statusCode: 404 };
                break;
        }

        return Weibo({
            method: _GET ? 'get' : 'post',
            endpoint: action_str,
            opts: wOpts
        })
        .then(function (data){

            switch (action){
                case 'reply':
                    switch (_GET){
                        case true:
                            return { data: profileFilter.weibo.reply(data.comments) }
                            break;
                        case false:
                    }
                case 'like':
                case 'star':
                case 'quote':
                case 'retweet':
                    return { id_str: data.idstr }
                    break;
            }
        })
    },
    instagram: function (action, opts){
        Ig.use({ access_token : opts.token })

        if (action === 'user'){
            return Q.all([
                Q.nbind(Ig.user, Ig)(opts.id),
                Q.nbind(Ig.user_media_recent, Ig)(opts.id, { count: 7 })
            ])
            .spread(function (userData, timelineData){
                var data = profileFilter.instagram.user(userData[0]);

                extend(data, { timeline: timelineFilter.instagram(timelineData[0]).data })

                return { data: data }
            })
        } else {
            var q_ig;

            switch (action){
                case 'like':
                    q_ig = Q.nbind(Ig.likes, Ig);
                    break;
                case 'reply':
                    q_ig = Q.nbind(Ig.comments, Ig);
                    break;
                default:
                    throw { statusCode: 404 };
                    break;
            }

            return q_ig(opts.id)
            .then(function (data){
                return { data: profileFilter.instagram[action](data[0].slice(0, 100)) }
            })
        }
    }
}

