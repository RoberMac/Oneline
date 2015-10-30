var extend  = require('extend'),
    Twit    = require('twit'),
    Ig      = require('instagram-node').instagram(),
    Weibo   = require('./weibo'),
    timelineFilter = require('./filter/timeline'),
    actionsFilter = require('./filter/actions');

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

        if (action === 'user' || action === 'direct'){
            var _action_str1, _action_str2, _tOpts1, _tOpts2;

            switch (action){
                case 'user':
                    _action_str1 = 'users/show'
                    _action_str2 = 'statuses/user_timeline'
                    _tOpts1 = { user_id: opts.id, include_entities: false }
                    _tOpts2 = {
                        user_id: opts.id,
                        count: 7,
                        trim_user: false,
                        exclude_replies: false,
                        contributor_details: false,
                        include_rts: true
                    }
                    break;
                case 'direct':
                    _action_str1 = 'direct_messages'
                    _action_str2 = 'direct_messages/sent'
                    _tOpts1 = _tOpts2 = { count: 200, include_entities: true }

                    if (opts.id !== '0'){
                        var _directId = opts.id.split('-')[1],
                            _directIdObj = opts.id.indexOf('max') >= 0
                                                ? { max_id: _directId }
                                            : { since_id: _directId };

                        extend(_tOpts1, _directIdObj)
                        extend(_tOpts2, _directIdObj)
                    }
                    break;
            }

            return Q.all([
                q_twit(_action_str1, _tOpts1),
                q_twit(_action_str2, _tOpts2)
            ])
            .spread(function (data1, data2){
                var data;
                switch (action){
                    case 'user':
                        data = actionsFilter.twitter.user(data1[0]);
                        extend(data, { timeline: timelineFilter.twitter(data2[0]).data })
                        break;
                    case 'direct':
                        data1 = actionsFilter.twitter.direct(data1[0])
                        data2 = actionsFilter.twitter.direct(data2[0])

                        data = {
                            data    : data1.data.concat(data2.data),
                            min_id  : (data1.min_date < data2.min_date
                                            ? data1.min_id
                                        : data2.min_id) || data1.min_id || data2.min_id,
                            min_date: Math.min(data1.min_date, data2.min_date) || undefined,
                            max_id  : (data1.max_date > data2.max_date 
                                            ? data1.max_id
                                        : data2.max_id) || data1.max_id || data2.max_id,
                            max_date: Math.max(data1.max_date, data2.max_date) || undefined
                        }
                        break;
                }

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
                    action_str = _GET
                                    ? 'friends/list'
                                : 'friendships/' + (opts.method === 'put' ? 'create' : 'destroy')

                    _GET
                        ? extend(tOpts, {
                            user_id: opts.id,
                            count: 200,
                            skip_status: true,
                            include_user_entities: false
                        })
                    : extend(tOpts, { id: opts.id })
                    break;
                case 'mentions':
                    action_str = 'statuses/mentions_timeline'

                    extend(tOpts, {
                        count: 200,
                        include_entities: false,
                        contributor_details: false
                    })

                    if (opts.id !== '0'){
                        var _mentionsId = opts.id.split('-')[1],
                            _mentionsIdObj = opts.id.indexOf('max') >= 0
                                                ? { max_id: _mentionsId }
                                            : { since_id: _mentionsId };

                        extend(tOpts, _mentionsIdObj)
                    }
                    break;
                case 'user_timeline':
                    action_str = 'statuses/user_timeline'

                    extend(tOpts, {
                        user_id: opts.id.split(':')[0],
                        max_id: opts.id.split(':')[1],
                        count: 20,
                        trim_user: false,
                        exclude_replies: false,
                        contributor_details: false,
                        include_rts: true
                    })
                    break;
                default:
                    throw { statusCode: 404 };
                    break;
            }

            return q_twit(action_str, tOpts)
            .then(function (data){
                if (_GET){
                    var _data ;
                    switch (action){
                        case 'retweet':
                        case 'reply':
                        case 'mentions':
                        case 'user_timeline':
                            _data = data[0]
                            break;
                        case 'follow':
                            _data = data.users
                            break;
                    }

                    return { data: actionsFilter.twitter[action](_data) }
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
                            return { data: actionsFilter.weibo.reply(data.comments) }
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
                var data = actionsFilter.instagram.user(userData[0]);

                extend(data, { timeline: timelineFilter.instagram(timelineData[0]).data })

                return { data: data }
            })
        } else {
            var q_ig, iOpts = {};

            switch (action){
                case 'like':
                    q_ig = Q.nbind(Ig.likes, Ig);
                    break;
                case 'reply':
                    q_ig = Q.nbind(Ig.comments, Ig);
                    break;
                case 'user_timeline':
                    q_ig = Q.nbind(Ig.user_media_recent, Ig);
                    break;
                default:
                    throw { statusCode: 404 };
                    break;
            }


            if (action === 'user_timeline'){
                return q_ig(opts.id.split(':')[0], { max_id: opts.id.split(':')[1] })
                .then(function (data){
                    return { data: timelineFilter.instagram(data[0]) }
                })
            } else {
                return q_ig(opts.id)
                .then(function (data){
                    return { data: actionsFilter.instagram[action](data[0].slice(0, 100)) }
                })
            }
        }
    }
}

