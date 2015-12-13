"use strict";
/* /timeline */
const router = require('express').Router();
const timelineFilter = require('./helper/filter/timeline');
const timeline   = require('./helper/timeline');


router.get('/', (req, res, next) => {
    // Init
    let olIdObj = {};

    if (req.query.id){
        req.query.id.split(',').forEach(id_str => {
            let key   = id_str.split('-')[0];
            let value = id_str.split('-')[1];

            olIdObj[key] = value
        })
    }

    // Fire
    Q.all([
        q_userFindOne({id: 'twitter' + req.olPassports.twitter}),
        q_userFindOne({id: 'instagram' + req.olPassports.instagram}),
        q_userFindOne({id: 'weibo' + req.olPassports.weibo})
    ])
    .then(providerList => {
        let timelinePromises = [];
        let _providerList = providerList.filter(provider => !!provider);

        if (_providerList.length < Object.keys(req.olPassports).length){
            throw { statusCode: 401 }
        }

        providerList.forEach((userInfo, index) => {
            if (!userInfo) return;

            let min_id = olIdObj[userInfo.provider + '_minId'];
            let max_id = olIdObj[userInfo.provider + '_maxId'];

            if (Object.keys(olIdObj).length > 0 && !(min_id || max_id)) return;

            let opts = {
                token      : userInfo.token,
                tokenSecret: userInfo.tokenSecret,
                min_id     : min_id,
                max_id     : max_id
            };

            timelinePromises[index] = timeline[userInfo.provider](opts)
        })

        return Q.all(timelinePromises);
    })
    .then(dataList => {
        let providerList = ['twitter', 'instagram', 'weibo'];
        let combineData = {
            data    : [],
            min_id  : {},
            max_id  : {},
            min_date: {},
            max_date: {},
        };

        dataList.forEach((dataItem, index) => {
            let provider = providerList[index];

            dataItem = JSON.parse(require('fs').readFileSync(process.env.PWD + '/ignore/test/timeline/data-weibo.json')).statuses
            // dataItem = provider === 'weibo' ? dataItem.statuses : dataItem[0];

            if (!dataItem) return;

            dataItem = timelineFilter[provider](dataItem)

            combineData.min_id[provider]   = dataItem.min_id
            combineData.max_id[provider]   = dataItem.max_id
            combineData.min_date[provider] = dataItem.min_date
            combineData.max_date[provider] = dataItem.max_date

            combineData.data = combineData.data.concat(dataItem.data)
        })

        res.json(combineData)
    })
    .fail(err => next(err))
})

module.exports = router