var Q = require('q');
var request = require('request');

module.exports = function (params){
    var deferred = Q.defer();
    var _method  = params.method;
    var _opts = { url: 'https://api.weibo.com/2/' + params.endpoint + '.json' };

    _opts[_method === 'get' ? 'qs' : 'form'] = params.opts;

    request[_method](_opts, function (err, res, body){
        body = parseBody(body)

        if (err || res.statusCode !== 200){
            var statusCode;
            try {
                statusCode = res.statusCode;
            } catch (e){
                statusCode = 400
            } finally {
                switch (body.error_code){
                    case 21327:
                        statusCode = 401
                        break;
                }
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
    var data;
    try {
        data = JSON.parse(body)
    } catch (e) {
        data = body
    } finally {
        return data
    }
}