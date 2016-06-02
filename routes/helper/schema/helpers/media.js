const Joi = require('joi');

const linkSchema = require('./link');

exports.media = (
    Joi
    .when('provider', {
        is  : 'twitter',
        then: Joi.array().items(Joi.object({
            type     : Joi.string().required(),
            image_url: linkSchema,
            video_url: linkSchema.optional(),
            ratio    : Joi.number().required(),
        })).optional(),
    })
    .when('provider', {
        is  : 'weibo',
        then: Joi.array().items(Joi.object({
            type     : Joi.string().valid('gif', 'photo').required(),
            image_url: linkSchema,
        })).optional(),
        otherwise: Joi.forbidden(),
    })
);

exports.images = (
    Joi
    .when('provider', {
        is  : 'unsplash',
        then: Joi.object({
            small: linkSchema,
            large: linkSchema,
            ratio: Joi.number().required(),
        }).required(),
        otherwise: Joi.forbidden(),
    })
);
