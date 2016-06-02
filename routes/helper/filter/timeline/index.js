const twitter   = require('./twitter');
const weibo     = require('./weibo');
const unsplash  = require('./unsplash');
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
 *     - provider: twitter, weibo, unsplash
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
 *     - images [u]
 *     - location
 *         - name
 *         - id
 *         - place_id [w]
 *     - retweet_count, retweeted [t|w]
 *     - like_count, liked
 *     - reply_count [w]
 *     - download_count [u]
 ---------------------------
   NEST POST: same as BASE
 ---------------------------
 *     - retweet, quote
 *
 *
 ------------------
 * [t] twitter
 * [w] weibo
 * [u] unsplash
 *
 */

module.exports = {
    twitter,
    weibo,
    unsplash,
};
