"use strict";
const Q = require('q');
const request = require('request');

// Heplers
const toJSON = require('./toJSON');
const API_URL = "https://api.unsplash.com";
const API_VERSION = "v1";
const OAUTH_TOKEN_URL = "https://unsplash.com/oauth/token";


module.exports = params => {
    const deferred = Q.defer();
    const _method  = params.method;

    // Build Request Options
    let _opts = {
        method: _method,
        url: `${params.type === 'oauth' ? OAUTH_TOKEN_URL : API_URL }${params.endpoint}`,
        headers: {
            'Accept-Version': API_VERSION,
            'Authorization': (
                params.access_token
                    ? `Bearer ${params.access_token}`
                : params.client_id
                    ? `Client-ID ${params.client_id}`
                : ''
            )
        }
    };
    _opts[_method === 'get' ? 'qs' : 'body'] = params.opts;

    // Start Request
    request(_opts, (err, res, body) => {
        body = toJSON(body)

        if (err || res.statusCode !== 200){
            let statusCode;
            try {
                statusCode = res.statusCode;
            } catch (e){
                statusCode = 400;
            } finally {
                deferred.reject({
                    statusCode: statusCode,
                    msg: body
                })
            }
        } else {
            deferred.resolve(body)
        }
    })

    return deferred.promise;
}