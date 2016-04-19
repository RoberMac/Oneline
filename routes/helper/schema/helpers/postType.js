const Joi = require('Joi');

module.exports = Joi.when('provider', {
    is  : ['twitter', 'weibo'],
    then: Joi.string().valid('tweet', 'retweet', 'quote').required(),
}).when('provider', {
    is       : ['instagram', 'unsplash'],
    then     : Joi.string().valid('post').required(),
    otherwise: Joi.forbidden(),
});

// .required() ?
