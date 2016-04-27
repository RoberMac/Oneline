const fs   = require('fs');
const Twit = require('twit');


module.exports = ({ token, tokenSecret, filePath }) => {
    const T = new Twit({
        consumer_key       : process.env.TWITTER_KEY,
        consumer_secret    : process.env.TWITTER_SECRET,
        access_token       : token,
        access_token_secret: tokenSecret,
    });
    const promiseTwit = Q.nbind(T.post, T);
    const b64content = fs.readFileSync(filePath, { encoding: 'base64' });

    return promiseTwit('media/upload', {
        media_data: b64content,
    })
    .then(data => ({ media_id: data[0].media_id_string }));
};
