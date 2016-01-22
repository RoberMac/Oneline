import qs from 'querystring';
import assign from 'object.assign';

// Low-level API
export const _fetch = ({ method, url, query, body }) => {
    const _url = query ? `${url}?${qs.encode(query)}` : url;
    const _opts = {
        method,
        headers: {}
    };

    if (body){
        const isJSON = Object.prototype.toString.call(body) === '[object Object]';

        assign(_opts, {
            headers: isJSON ? {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            } : {},
            body: isJSON ? JSON.stringify(body) : body
        })
    }

    // Authorize Request
    const authorizeRequest = (url) => {
        const protectedEndpoints = [
            '/timeline',
            '/actions',
            '/auth/revoke',
            '/auth/replicant/deckard',
            '/upload'
        ];

        if (protectedEndpoints.some(endpoint => url.search(endpoint) >= 0)){
            let token = localStorage.getItem('tokenList');
            return { authorization: `Bearer ${token}` };
        } else {
            return {};
        }
    };
    assign(_opts.headers, authorizeRequest(url))


    return fetch(_url, _opts)
    .then(res => {
        // Check Status
        if (res.status >= 200 && res.status < 300) {
            return res;
        } else {
            let error = new Error(res.statusText)
            error.res = res
            throw error
        }
    })
    .then(res => res.json())
    .catch(err => {
        __DEV__ && console.error(err)
        throw err
    })
};
export const Auth = {
    revoke: ({ provider }) => _fetch({
        method: 'DELETE',
        url: `/auth/revoke/${provider}`
    }),
    deckard: ({ profileList }) => _fetch({
        method: 'GET',
        url: '/auth/replicant/deckard',
        query: profileList && { profileList }
    }),
    rachael: ({ code }) => _fetch({
        method: 'POST',
        url: '/auth/replicant/rachael',
        body: { code }
    })
}
export const Timeline = {
    get: ({ id }) => _fetch({
        method: 'GET',
        url: '/timeline',
        query: id && { id }
    })
}
export const Action = {
    create: ({ action, provider, id }) => _fetch({
        method: 'PUT',
        url: `/actions/${action}/${provider}/${id || 0}`
    }),
    destroy: ({ action, provider, id }) => _fetch({
        method: 'DELETE',
        url: `/actions/${action}/${provider}/${id || 0}`
    }),
    update: ({ action, provider, id }, body) => _fetch({
        method: 'POST',
        url: `/actions/${action}/${provider}/${id || 0}`,
        body
    }),
    get: ({ action, provider, id }, query) => _fetch({
        method: 'GET',
        url: `/actions/${action}/${provider}/${id || 0}`,
        query
    })
}
export const Media = {
    upload: ({ provider }, body) => _fetch({
        method: 'POST',
        url: `/upload/${provider}`,
        body
    })
}