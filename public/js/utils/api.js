import superagent from 'superagent';
import { Promise } from 'es6-promise';

// Middlewares
const protectedEndpoints = [
    '/timeline',
    '/actions',
    '/auth/revoke',
    '/auth/replicant/deckard',
    '/upload'
];
const authorizeRequest = req => {
    if (protectedEndpoints.some( endpoint => req.url.search(endpoint) >= 0 )){
        let token = localStorage.getItem('tokenList');
        req.header.authorization = `Bearer ${token}`;
    }

    return req;
};

// Promisify
const request = {
    get: ({ url, query }) => (
        new Promise((resolve, reject) => {
            superagent
            .get(url)
            .use(authorizeRequest)
            .query(query)
            .end((err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    ),
    post: ({ url, payload }) => (
        new Promise((resolve, reject) => {
            superagent
            .post(url)
            .use(authorizeRequest)
            .send(payload)
            .end((err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    ),
    put: ({ url }) => (
        new Promise((resolve, reject) => {
            superagent
            .put(url)
            .use(authorizeRequest)
            .end((err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    ),
    del: ({ url }) => (
        new Promise((resolve, reject) => {
            superagent
            .del(url)
            .use(authorizeRequest)
            .end((err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    ),
};

// Export
export const Auth = {
    revoke: ({ provider }) => request.del({ url: `/auth/revoke/${provider}`}),
    deckard: ({ profileList }) => request.get({ url: '/auth/replicant/deckard', query: { profileList } }),
    rachael: ({ code }) => request.post({ url: '/auth/replicant/rachael', payload: { code } })
}

export const Timeline = {
    get: ({ id }) => request.get({ url: '/timeline', query: { id } })
}

export const Action = {
    create: ({ action, provider, id }) => request.put({
        url: `/actions/${action}/${provider}/${id || 0}`
    }),
    destroy: ({ action, provider, id }) => request.del({
        url: `/actions/${action}/${provider}/${id || 0}`
    }),
    update: ({ action, provider, id }, payload) => request.post({
        url: `/actions/${action}/${provider}/${id || 0}`,
        payload
    }),
    get: ({ action, provider, id }) => request.get({
        url: `/actions/${action}/${provider}/${id || 0}`
    })
}
export const Media = {
    upload: ({ provider }, payload) => request.post({ url: `/upload/${provider}`, payload })
}