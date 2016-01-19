import {
    addToken as _addToken,
    removeToken as _removeToken,
    replaceTokenList as _replaceTokenList,
    isValidToken as _isValidToken,
    clearTokenList as _clearTokenList
} from '../utils/tokenHelper';
import { Auth } from 'utils/api';

// Export
export const UPDATE_TOKEN = 'UPDATE_TOKEN'


export const addToken = () => {
    const { activeProviders, tokenList } = _addToken();
    return { type: UPDATE_TOKEN, activeProviders, tokenList }
}
export const removeToken = (provider) => {
    Auth.revoke({ provider })

    const { activeProviders, tokenList } = _removeToken(provider);
    return { type: UPDATE_TOKEN, activeProviders, tokenList }
}
export const replaceTokenList = (_tokenList) => {
    const { activeProviders, tokenList } = _replaceTokenList(_tokenList);
    return { type: UPDATE_TOKEN, activeProviders, tokenList }
}
export const clearTokenIfTokenExpired = () => {
    return (dispatch, getState) => {
        if (!_isValidToken()){
            const { activeProviders, tokenList } = _clearTokenList();
            dispatch({ type: UPDATE_TOKEN, activeProviders, tokenList })
        }
    }
}