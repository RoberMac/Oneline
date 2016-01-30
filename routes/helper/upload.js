"use strict";
const fs   = require('fs');
const Twit = require('twit');


module.exports = {
    twitter: opts => {

        let T = new Twit({
            consumer_key       : process.env.TWITTER_KEY,
            consumer_secret    : process.env.TWITTER_SECRET,
            access_token       : opts.token,
            access_token_secret: opts.tokenSecret
        });
        let q_twit = Q.nbind(T.post, T);
        let b64content = fs.readFileSync(opts.filePath, { encoding: 'base64' });

        return q_twit('media/upload', { media_data: b64content })
        .then(data => ({ media_id: data[0].media_id_string }))
    }
}
