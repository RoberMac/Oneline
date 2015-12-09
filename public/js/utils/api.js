import * as request from 'superagent';

// Middlewares
const authorizeRequest = req => {
    let token = localStorage.getItem('tokenList');
    req.header.authorization = `Bearer ${token}`;
    return req;
};


export const Auth = {
    revoke: ({ provider }) => {
        request
        .del(`/auth/revoke/${provider}`)
        .use(authorizeRequest)
        .end()
    }
}