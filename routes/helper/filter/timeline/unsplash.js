const filterUtils = require('../utils');


module.exports = data => {
    const now = Date.now();
    const postsLength = data.length;
    const cache = [];

    data.forEach((item, index) => {
        const post = {
            provider  : 'unsplash',
            created_at: now + (postsLength - index),
            id_str    : item.id,
            type      : 'post',
            user      : filterUtils.unsplash.user(item.user),
            text      : filterUtils.unsplash.text(item.categories),
            images    : filterUtils.unsplash.media({
                urls  : item.urls,
                width : item.width,
                height: item.height,
            }),
            like_count    : item.likes,
            liked         : item.liked_by_user,
            download_count: item.downloads,
        };

        // Location
        if (item.location) {
            Object.assign(post, {
                location: {
                    name: item.location.city || item.location.country,
                },
            });
        }

        cache.push(post);
    });

    const returnObj = { data: cache };
    const firstData = cache[0];
    const lastData  = cache[postsLength - 1];

    if (lastData) {
        Object.assign(returnObj, {
            minId  : lastData.id_str,
            minDate: lastData.created_at,
            maxId  : firstData.id_str,
            maxDate: firstData.created_at,
        });
    }

    return returnObj;
};
