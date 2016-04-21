const Joi = require('joi');

const linkSchema = require('./link');

module.exports = Joi.when('provider', {
    is       : 'instagram',
    then     : linkSchema,
    otherwise: Joi.forbidden(),
});
