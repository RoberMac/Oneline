import store from './store';
import jwtHelper from './jwtHelper';

const _removeToken = (tokenList, provider) => {
    return tokenList.filter(token => provider !== jwtHelper.decodeToken(token).provider)
};

/* 添加 token */
export const addToken = () => {
    let newToken  = localStorage.getItem('addToken');
    let provider  = jwtHelper.decodeToken(newToken).provider;
    let tokenList = store.get('tokenList') || [];

    // 刪除相同 provider 的 token
    tokenList = _removeToken(tokenList, provider)

    tokenList.push(newToken)
    store.set('tokenList', tokenList)

    // 刪除 `addToken`
    store.remove('addToken')
}

// 替換整個 tokenList
export const replaceTokenList = tokenList => {
    store.set('tokenList', tokenList)
}

/* 刪除指定 provider 的 token */
export const removeToken = provider => {
    let tokenList = store.get('tokenList') || [];

    tokenList = _removeToken(tokenList, provider)

    store.set('tokenList', tokenList)
}

/* 清空無效 token */
export const clearInvalidToken = () => {
    let tokenList = store.get('tokenList') || [];

    tokenList.forEach(token => {
        const isTokenExpired = jwtHelper.isTokenExpired(token);
        const provider = jwtHelper.decodeToken(token).provider;

        if (isTokenExpired){
            removeToken(provider)
        }
    })
}

/* 獲取 active providers 列表 */
export const getActiveProviders = () => {
    let tokenList = store.get('tokenList') || [];

    return tokenList.map(token => jwtHelper.decodeToken(token).provider);
}

/* 驗證 token 是否有效 */
export const isValidToken = () => {
    let tokenList = store.get('tokenList') || [];

    return (tokenList.length > 0) && tokenList.every(token => !jwtHelper.isTokenExpired(token));
}