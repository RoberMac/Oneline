'use strict';

const providerSchema = require('./helpers/provider');
const userSchema = require('./helpers/user');

module.exports = userSchema.keys({
    provider: providerSchema,
}).unknown();
