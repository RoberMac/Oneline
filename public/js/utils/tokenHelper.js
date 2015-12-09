import store from '../utils/store';
import { decodeToken, isTokenExpired } from '../utils/jwtHelper';

// Utils
const _removeToken = (tokenList, provider) => {
    return tokenList.filter(token => provider !== decodeToken(token).provider)
};

// Export
export const addToken = () => {
    let newToken  = store.get('addToken');
    let provider  = decodeToken(newToken).provider;
    let tokenList = store.get('tokenList') || [];

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
    let tokenList = store.get('tokenList') || [];

    tokenList = _removeToken(tokenList, provider)

    store.set('tokenList', tokenList)

    return {
        activeProviders: getActiveProviders(),
        tokenList
    };
}
export const clearInvalidToken = () => {
    let tokenList = store.get('tokenList') || [];

    tokenList.forEach(token => {
        const isTokenExpired = isTokenExpired(token);
        const provider = decodeToken(token).provider;

        if (isTokenExpired){
            removeToken(provider)
        }
    })
}
export const isValidToken = () => {
    let tokenList = store.get('tokenList') || [];

    return (tokenList.length > 0) && tokenList.every(token => !isTokenExpired(token));
}
export const getActiveProviders = () => (
    store.get('tokenList') || []).map(token => decodeToken(token).provider
);



