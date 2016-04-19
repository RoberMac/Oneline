const Joi = require('Joi');

const linkSchema = require('./link');

// only valid when 'provider' is 'twitter' and 'media' is providerd
module.exports = Joi.when('provider', {
    is  : 'twitter',
    then: Joi.when('media', {
        is  : Joi.any().required(),
        then: linkSchema,
    }),
    otherwise: Joi.forbidden(),
});
