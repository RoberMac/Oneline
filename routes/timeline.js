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

            let minId = olIdObj[userInfo.provider + '_minId'];
            let maxId = olIdObj[userInfo.provider + '_maxId'];

            if (Object.keys(olIdObj).length > 0 && !(minId || maxId)) return;

            let opts = {
                token      : userInfo.token,
                tokenSecret: userInfo.tokenSecret,
                minId     : minId,
                maxId     : maxId
            };

            timelinePromises[index] = timeline[userInfo.provider](opts)
        })

        return Q.all(timelinePromises);
    })
    .then(dataList => {
        let providerList = ['twitter', 'instagram', 'weibo'];
        let combineData = {
            data    : [],
            minId  : {},
            maxId  : {},
            minDate: {},
            maxDate: {},
        };

        dataList.forEach((dataItem, index) => {
            let provider = providerList[index];

            dataItem = (
                provider === 'weibo'
                    ? dataItem && dataItem.statuses
                : dataItem && dataItem[0]
            );

            if (!dataItem) return;

            dataItem = timelineFilter[provider](dataItem)

            combineData.minId[provider]   = dataItem.minId
            combineData.maxId[provider]   = dataItem.maxId
            combineData.minDate[provider] = dataItem.minDate
            combineData.maxDate[provider] = dataItem.maxDate

            combineData.data = combineData.data.concat(dataItem.data)
        })

        res.json(combineData)
    })
    .fail(err => next(err))
})

module.exports = router