import store from 'utils/store';
import { decodeToken, isTokenExpired } from 'utils/jwtHelper';

// Helpers
const _removeToken = (tokenList, provider) => {
    return tokenList.filter(token => provider !== decodeToken(token).provider)
};
const getTokenList = () => {
    const isArray = target => Object.prototype.toString.call(target) === '[object Array]';
    let tokenList = store.get('tokenList');

    if (!isArray(tokenList)) tokenList = [];

    return tokenList;
};

// Export
export const addToken = () => {
    let newToken  = store.get('addToken');
    let provider  = decodeToken(newToken).provider;
    let tokenList = getTokenList();

    // Remove Dups Token
    tokenList = _removeToken(tokenList, provider)
    // Add Token
    tokenList.push(newToken)
    store.set('tokenList', tokenList)
    store.remove('addToken')

    return {
        activeProviders: getActiveProviders(),
        tokenList
    };
}
export const removeToken = provider => {
    let tokenList = getTokenList();

    tokenList = _removeToken(tokenList, provider)

    store.set('tokenList', tokenList)

    return {
        activeProviders: getActiveProviders(),
        tokenList
    };
}
export const replaceTokenList = tokenList => {
    store.set('tokenList', tokenList)

    return {
        activeProviders: getActiveProviders(),
        tokenList: getTokenList()
    };
}
export const clearTokenList = () => {
    store.set('tokenList', [])

    return {
        activeProviders: [],
        tokenList: []
    }
}
export const isValidToken = () => {
    let tokenList = getTokenList();

    return (tokenList.length > 0) && tokenList.every(token => !isTokenExpired(token));
}
export const getActiveProviders = () => getTokenList().map(token => decodeToken(token).provider);



