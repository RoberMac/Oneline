const Joi = require('Joi');

module.exports = Joi.string().valid('twitter', 'instagram', 'weibo', 'unsplash').required();
