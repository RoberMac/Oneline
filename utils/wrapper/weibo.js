'use strict';

const Q = require('q');
const request = require('request');

const toJSON = require('./toJSON');

module.exports = params => {
    const deferred = Q.defer();
    const _method  = params.method;
    const _opts = { url: `https://api.weibo.com/2/${params.endpoint}.json` };

    _opts[_method === 'get' ? 'qs' : 'form'] = params.opts;

    request[_method](_opts, (err, res, body) => {
        body = toJSON(body);

        if (err || !/2\d\d/.test(res.statusCode)) {
            let statusCode;
            try {
                statusCode = res.statusCode;

                switch (body.error_code) {
                    case 21314:
                    case 21315:
                    case 21316:
                    case 21317:
                    case 21327:
                        statusCode = 401;
                        break;
                    default:
                        break;
                }
            } catch (e) {
                statusCode = 400;
            } finally {
                deferred.reject({
                    statusCode,
                    msg: body,
                });
            }
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
};
