const Joi = require('Joi');

exports.retweet_count = (
    Joi
    .when('provider', {
        is       : ['twitter', 'weibo'],
        then     : Joi.number().required(),
        otherwise: Joi.forbidden(),
    })
);
exports.retweeted = (
    Joi
    .when('provider', {
        is       : ['twitter', 'weibo'],
        then     : Joi.boolean().required(),
        otherwise: Joi.forbidden(),
    })
);

exports.like_count = Joi.number().required();
exports.liked = Joi.boolean().required();

exports.reply_count = (
    Joi
    .when('provider', {
        is       : ['instagram', 'weibo'],
        then     : Joi.number().required(),
        otherwise: Joi.forbidden(),
    })
);

exports.download_count = (
    Joi
    .when('provider', {
        is       : 'unsplash',
        then     : Joi.number().required(),
        otherwise: Joi.forbidden(),
    })
);