const Q = require('q');
const request = require('request');

// Heplers
const toJSON = require('./toJSON');
const API_URL = 'https://api.unsplash.com';
const API_VERSION = 'v1';
const OAUTH_TOKEN_URL = 'https://unsplash.com/oauth';

module.exports = ({ method, endpoint, type, access_token, client_id, opts }) => {
    const deferred = Q.defer();

    // Build Request Options
    const reqOpts = {
        method,
        url    : `${type === 'oauth' ? OAUTH_TOKEN_URL : API_URL}${endpoint}`,
        headers: {
            'Accept-Version': API_VERSION,
            Authorization   : (
                access_token
                    ? `Bearer ${access_token}`
                : client_id
                    ? `Client-ID ${client_id}`
                : ''
            ),
        },
    };

    if (method === 'get') {
        Object.assign(reqOpts, { qs: opts });
    } else if (method === 'post') {
        Object.assign(reqOpts, {
            body: opts,
            json: true,
        });
    }

    // Start Request
    request(reqOpts, (err, res, body) => {
        body = toJSON(body);

        if (err || !/2\d\d/.test(res.statusCode)) {
            let statusCode;
            const msg = body && body.errors && body.errors[0] || body || 'no error messages';
            try {
                statusCode = res.statusCode;
            } catch (e) {
                statusCode = 400;
            } finally {
                deferred.reject({ statusCode, msg });
            }
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
};
