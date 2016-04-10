'use strict';
const Unsplash = require(`${__base}/utils/wrapper/unsplash`);

function refreshToken(refresh_token) {
    return Unsplash({
        method  : 'post',
        type    : 'oauth',
        endpoint: '/token',
        opts    : {
            refresh_token,
            client_id    : process.env.UNSPLASH_KEY,
            client_secret: process.env.UNSPLASH_SECRET,
            grant_type   : 'refresh_token',
        },
    });
}

module.exports = {
    refreshToken,
};
