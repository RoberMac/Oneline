"use strict";
const Weibo = require(`${__base}/utils/wrapper/weibo`);


module.exports = opts => {
    const wOpts = Object.assign({
        access_token: opts.token,
        count: opts.count || 100
    }, (
        opts.minId
            ? { since_id: opts.minId }
        : opts.maxId
            ? { max_id: opts.maxId }
        : {}
    ));

    return Weibo({
        method: 'get',
        endpoint: 'statuses/home_timeline',
        opts: wOpts
    })
    .then((data) => {
        if (opts.maxId){
            data['statuses'].splice(0, 1)
        }
        return data;
    });
};