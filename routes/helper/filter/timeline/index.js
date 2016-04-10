/*
 ------------------
   POST STRUCTURE
 ------------------
 *
 * - Post
 ---------
    BASE
 ---------
 *     - type: tweet, retweet, quote
 *     - provider: twitter, instagram, weibo, unsplash
 *     - created_at
 *     - id_str
 *     - mid [w]
 *     - link [i]
 *     - user
 *         - name
 *         - screen_name
 *         - uid
 *         - avatar
 *     - text
 *     - media [t|w]
 *     - mediaLink [t]
 *     - images, videos [i]
 *     - location
 *         - name
 *         - id
 *         - place_id [w]
 *     - retweet_count, retweeted [t|w]
 *     - like_count, liked
 *     - reply_count [i, w]
 *     - download_count [u]
 ---------------------------
   NEST POST: same as BASE
 ---------------------------
 *     - retweet, quote
 *
 *
 ------------------
 * [t] twitter
 * [i] instagram
 * [w] weibo
 * [u] unsplash
 *
 */
module.exports = {
    twitter  : require('./twitter'),
    instagram: require('./instagram'),
    weibo    : require('./weibo'),
    unsplash : require('./unsplash'),
};
