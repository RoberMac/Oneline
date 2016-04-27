const router = require('express').Router();
const timelineFilter = require('./helper/filter/timeline');
const timelineFetch = require('./helper/api/timeline');

router.get('/', (req, res, next) => {
    // Init
    const olIdObj = {};

    if (req.query.id) {
        req.query.id.split(',').forEach(id_str => {
            const id_split = id_str.split('Id-');
            const key   = `${id_split[0]}Id`;
            const value = id_split[1];

            olIdObj[key] = value;
        });
    }

    // Fire
    const { twitter, instagram, weibo, unsplash } = req.olPassports;
    Q.all([
        promiseUserFindOne({ id: `twitter${twitter}` }),
        promiseUserFindOne({ id: `instagram${instagram}` }),
        promiseUserFindOne({ id: `weibo${weibo}` }),
        promiseUserFindOne({ id: `unsplash${unsplash}` }),
    ])
    .then(profileList => {
        const validProfileList = profileList.filter(i => i);
        const timelinePromises = [];

        if (validProfileList.length < Object.keys(req.olPassports).length) {
            throw { statusCode: 401 };
        }

        profileList.forEach((profile, index) => {
            if (!profile) return;

            const { provider, token, tokenSecret } = profile;
            const minId = olIdObj[`${provider}_minId`];
            const maxId = olIdObj[`${provider}_maxId`];

            if (Object.keys(olIdObj).length > 0 && !(minId || maxId)) return;

            timelinePromises[index] = timelineFetch[provider]({
                minId,
                maxId,
                token,
                tokenSecret,
            });
        });

        return Q.all(timelinePromises);
    })
    .then(dataList => {
        const providerList = ['twitter', 'instagram', 'weibo', 'unsplash'];
        const combineData = {
            data   : [],
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

            dataItem = timelineFilter[provider](dataItem);

            combineData.minId[provider] = dataItem.minId;
            combineData.maxId[provider] = dataItem.maxId;
            combineData.minDate[provider] = dataItem.minDate;
            combineData.maxDate[provider] = dataItem.maxDate;
            combineData.data = combineData.data.concat(dataItem.data);
        });

        res.json(combineData);
    })
    .fail(err => next(err));
});

module.exports = router;
