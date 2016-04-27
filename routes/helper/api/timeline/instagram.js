const Ig = require('instagram-node').instagram();

module.exports = ({ minId, maxId, token, count }) => {
    Ig.use({ access_token: token });

    const promiseIg = Q.nbind(Ig.user_self_feed, Ig);
    const iOpts = Object.assign({
        count: count || 100,
    }, (
        minId
            ? { min_id: minId }
        : maxId
            ? { max_id: maxId }
        : {}
    ));

    return promiseIg(iOpts);
};
