const Joi = require('Joi');

module.exports = Joi.object({
    name: Joi.string().required(),
    id  : Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    // place_id // [w]
});
