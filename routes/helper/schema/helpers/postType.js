const Joi = require('joi');

module.exports = Joi.when('provider', {
    is  : ['twitter', 'weibo'],
    then: Joi.string().valid('tweet', 'retweet', 'quote').required(),
}).when('provider', {
    is       : ['unsplash'],
    then     : Joi.string().valid('post').required(),
    otherwise: Joi.forbidden(),
});

// .required() ?
