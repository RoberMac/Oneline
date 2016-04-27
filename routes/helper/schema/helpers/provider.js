const Joi = require('joi');

module.exports = Joi.string().valid('twitter', 'instagram', 'weibo', 'unsplash').required();
