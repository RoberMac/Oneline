const Joi = require('Joi');

module.exports = Joi.string().uri({ scheme: [/https?/] }).required();
