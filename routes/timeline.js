/* /timeline */
var router = require('express').Router(),
    filter = require('./helper/filter/timeline'),
    feed   = require('./helper/timeline');


router.get('/', function (req, res, next){
    // Init
    var olIdObj   = {};

    if (req.query.id){
        req.query.id.split(',').forEach(function (id_str){
            var key   = id_str.split('-')[0],
                value = id_str.split('-')[1];

            olIdObj[key] = value
        })
    }

    // Fire
    Q.all([
        q_userFindOne({id: 'twitter' + req.olPassports.twitter}),
        q_userFindOne({id: 'instagram' + req.olPassports.instagram}),
        q_userFindOne({id: 'weibo' + req.olPassports.weibo})
    ])
    .then(function (providerList){
        var feedPromises = [],
            _providerList = providerList.filter(function (provider){
                return !!provider
            })

        if (_providerList.length < Object.keys(req.olPassports).length){
            throw { statusCode: 401 }
        }

        providerList.forEach(function (userInfo, index){
            if (!userInfo) return;

            var min_id = olIdObj[userInfo['provider'] + '_minId'],
                max_id = olIdObj[userInfo['provider'] + '_maxId'];

            if (Object.keys(olIdObj).length > 0 && !(min_id || max_id)) return;

            var opts = {
                token      : userInfo['token'],
                tokenSecret: userInfo['tokenSecret'],
                min_id     : min_id,
                max_id     : max_id
            }

            feedPromises[index] = feed[userInfo['provider']](opts)
        })

        return Q.all(feedPromises)
    })
    .then(handleData(res))
    .fail(function (err){
        next(err)
    })
})

function handleData(res){
    return function (dataList){
        var providerList = ['twitter', 'instagram', 'weibo'],
            combineData = {
                data    : [],
                min_id  : {},
                max_id  : {},
                min_date: {},
                max_date: {},
            };

        dataList.forEach(function (dataItem, index){
            var provider = providerList[index],
                dataItem = provider === 'weibo' ? dataItem['statuses'] : dataItem[0];

            if (!dataItem) return;

            dataItem = filter[provider](dataItem)

            combineData.min_id[provider]   = dataItem.min_id
            combineData.max_id[provider]   = dataItem.max_id
            combineData.min_date[provider] = dataItem.min_date
            combineData.max_date[provider] = dataItem.max_date

            combineData.data = combineData.data.concat(dataItem.data)
        })

        res.json(combineData)
    }
}

module.exports = router