/* /timeline */
var router = require('express').Router(),
    filter = require('./helper/filter'),
    feed   = require('./helper/timeline');


// Handing `id` Params
router.param('id', function (req, res, next, id){
    var olIdObj   = {},
        arrayOfId = id.split(',');

    arrayOfId.forEach(function (id_str){
        var key   = id_str.split('-')[0],
            value = id_str.split('-')[1];

        olIdObj[key] = value
    })

    req.olId = olIdObj

    next()
})
// Handing `count` Params
router.param('count', function (req, res, next, count){

    req.olCount = count

    next()
})

// Init Load
router.get('/', function (req, res, next){

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
            throw { statusCode: 401, invalidToken: ['twitter', 'instagram', 'weibo']}
        }

        providerList.forEach(function (userInfo, index){
            if (!userInfo) return;

            feedPromises[index] = feed[userInfo['provider']]({
                token      : userInfo['token'],
                tokenSecret: userInfo['tokenSecret']
            })
        })

        return Q.all(feedPromises)
    })
    .then(handleData(req, res, next))
    .fail(function (err){
        next(err)
    })
})

// Load More
router.get('/:id/:count', function (req, res, next){

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

            var min_id = req.olId[userInfo['provider'] + '_minId'],
                max_id = req.olId[userInfo['provider'] + '_maxId'];

            if (!userInfo || !(min_id || max_id)) return;

            feedPromises[index] = feed[userInfo['provider']]({
                token      : userInfo['token'],
                tokenSecret: userInfo['tokenSecret'],
                since_id   : min_id,
                min_id     : min_id,
                max_id     : max_id,
                count      : req.olCount
            })
        })

        return Q.all(feedPromises)
    })
    .then(handleData(req, res, next))
    .fail(function (err){
        next(err)
    })
})

function handleData(req, res, next){
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