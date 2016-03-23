"use strict";
const Q = require('q');
const request = require('request');

// Heplers
const toJSON = require('./toJSON');
const API_URL = "https://api.unsplash.com";
const API_VERSION = "v1";
const OAUTH_TOKEN_URL = "https://unsplash.com/oauth";


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

    if (_method === 'get') {
        _opts.qs = params.opts;
    } else if (_method === 'post') {
        _opts.body = params.opts;
        _opts.json = true;
    }

    // Start Request
    request(_opts, (err, res, body) => {
        body = toJSON(body);

        if (err || !/2\d\d/.test(res.statusCode)){
            let statusCode;
            const msg = body && body.errors && body.errors[0] || body || 'no error messages';
            try {
                statusCode = res.statusCode;
            } catch (e){
                statusCode = 400;
            } finally {
                deferred.reject({ statusCode, msg })
            }
        } else {
            deferred.resolve(body)
        }
    })

    return deferred.promise;
}