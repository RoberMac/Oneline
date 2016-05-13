/* eslint newline-per-chained-call: 0 */

const Joi = require('joi');

// Helpers
const providerSchema = require('./helpers/provider');
const postTypeSchema = require('./helpers/postType');
const userSchema = require('./helpers/user');
const locationSchema = require('./helpers/location');
const mediaSchema = require('./helpers/media');
const actionSchema = require('./helpers/action');
const midSchema = require('./helpers/mid');
const srcLinkSchema = require('./helpers/srcLink');
const mediaLinkSchema = require('./helpers/mediaLink');

const postSchema = Joi.object().keys({
    // Commons (Required)
    created_at    : Joi.number().min(0).required().strict(),
    id_str        : Joi.string().required(),
    text          : Joi.string().empty('').required(),
    provider      : providerSchema,
    type          : postTypeSchema,
    user          : userSchema,
    like_count    : actionSchema.like_count,
    liked         : actionSchema.liked,
    // Common (Optional)
    location      : locationSchema,
    // Medias
    media         : mediaSchema.media, // optional [t|w]
    images        : mediaSchema.images, // required [i|u]
    videos        : mediaSchema.videos, // optional [i]
    // Actions (Required)
    retweet_count : actionSchema.retweet_count, // [t|w]
    retweeted     : actionSchema.retweeted, // [t|w]
    reply_count   : actionSchema.reply_count, // [i|w]
    download_count: actionSchema.download_count, // [u]
    // Others
    mid           : midSchema, // required [w]
    link          : srcLinkSchema, // required [i]
    mediaLink     : mediaLinkSchema, // optional [t]
}).unknown().required();

// Export
module.exports = postSchema.keys({
    retweet: Joi.when('type', {
        is       : 'retweet',
        then     : postSchema,
        otherwise: Joi.forbidden(),
    }),
    quote: Joi.when('type', {
        is       : 'quote',
        then     : postSchema,
        otherwise: Joi.forbidden(),
    }),
});
