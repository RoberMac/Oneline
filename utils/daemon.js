var Unsplash = require('./wrapper/unsplash');

/**
 * State Cache
 *
 */
const stateStore = {};
const state = {
    get: key => stateStore[key],
    set: (key, value) => { stateStore[key] = value; }
};

/***
 *  Auto Fetch
 *
 */
function autoFetch() {
    // Auto Fetch Unsplash Photo (every 3 mins))
    (function autoFetchUnsplash() {
        Unsplash({
            method: 'get',
            endpoint: '/photos/random',
            client_id: process.env.UNSPLASH_KEY
        })
        .then(data => state.set('unsplash', data))
        .fail(err => console.error(err))

        setTimeout(autoFetchUnsplash, 1000 * 60 * 3)
    })()
}


module.exports = {
    autoFetch: autoFetch,
    state: state
};