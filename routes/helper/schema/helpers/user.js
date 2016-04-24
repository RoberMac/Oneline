'use strict';

const Joi = require('joi');

const linkSchema = require('./link');

module.exports = Joi.object({
    uid        : Joi.string().required(),
    avatar     : linkSchema,
    name       : Joi.string().empty('').required(),
    screen_name: Joi.string().required(),
}).unknown().required();
