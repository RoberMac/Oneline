const Joi = require('joi');

module.exports = Joi.string().valid('twitter', 'weibo', 'unsplash').required();
