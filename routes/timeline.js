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
    .then(profileList => {
        const validProfileList = profileList.filter(i => i);
        let timelinePromises = [];

        if (validProfileList.length < Object.keys(req.olPassports).length){
            throw { statusCode: 401 }
        }

        profileList.forEach((profile, index) => {
            if (!profile) return;

            const provider = profile.provider;
            const token = profile.token;
            const tokenSecret = profile.tokenSecret;
            const minId = olIdObj[`${provider}_minId`];
            const maxId = olIdObj[`${provider}_maxId`];

            if (Object.keys(olIdObj).length > 0 && !(minId || maxId)) return;

            timelinePromises[index] = timeline[provider]({
                minId,
                maxId,
                token,
                tokenSecret
            })
        })

        return Q.all(timelinePromises);
    })
    .then(dataList => {
        const providerList = ['twitter', 'instagram', 'weibo'];
        let combineData = {
            data    : [],
            minId  : {},
            maxId  : {},
            minDate: {},
            maxDate: {},
        };

        dataList.forEach((dataItem, index) => {
            const provider = providerList[index];

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