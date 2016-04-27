const Weibo = require(`${__base}/utils/wrapper/weibo`);


module.exports = ({ minId, maxId, token, count }) => {
    const wOpts = Object.assign({
        access_token: token,
        count       : count || 100,
    }, (
        minId
            ? { since_id: minId }
        : maxId
            ? { max_id: maxId }
        : {}
    ));

    return Weibo({
        method  : 'get',
        endpoint: 'statuses/home_timeline',
        opts    : wOpts,
    })
    .then((data) => {
        if (maxId) {
            data.statuses.splice(0, 1);
        }
        return data;
    });
};
