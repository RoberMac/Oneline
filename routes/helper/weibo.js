"use strict";

const Q = require('q');
const request = require('request');

module.exports = (params) => {
    let deferred = Q.defer();
    let _method  = params.method;
    let _opts = { url: 'https://api.weibo.com/2/' + params.endpoint + '.json' };

    _opts[_method === 'get' ? 'qs' : 'form'] = params.opts;

    request[_method](_opts, (err, res, body) => {
        body = parseBody(body)

        if (err || res.statusCode !== 200){
            let statusCode;
            try {
                statusCode = res.statusCode;

                switch (body.error_code){
                    case 21314:
                    case 21315:
                    case 21316:
                    case 21317:
                    case 21327:
                        statusCode = 401
                        break;
                }
            } catch (e){
                statusCode = 400
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

function parseBody(body){
    let data;
    try {
        data = JSON.parse(body)
    } catch (e) {
        data = body
    } finally {
        return data
    }
}