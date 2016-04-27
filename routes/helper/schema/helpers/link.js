const Joi = require('joi');

module.exports = Joi.string().uri({ scheme: [/https?/] }).required();
