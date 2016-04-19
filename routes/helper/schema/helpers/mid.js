const Joi = require('Joi');

module.exports = Joi.when('provider', {
    is       : 'weibo',
    then     : Joi.string().required(),
    otherwise: Joi.forbidden(),
});
