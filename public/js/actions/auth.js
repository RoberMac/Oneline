import {
    addToken as _addToken,
    removeToken as _removeToken,
    replaceTokenList as _replaceTokenList
} from '../utils/tokenHelper';
import { Auth } from '../utils/api';

// Export
export const ADD_TOKEN = 'ADD_TOKEN'
export const addToken = () => {
    const { activeProviders, tokenList } = _addToken();
    return { type: ADD_TOKEN, activeProviders, tokenList }
}

export const REMOVE_TOKEN = 'REMOVE_TOKEN'
export const removeToken = (provider) => {
    Auth.revoke({ provider })

    const { activeProviders, tokenList } = _removeToken(provider);

    return { type: REMOVE_TOKEN, activeProviders, tokenList }
}

export const REPLACE_TOKEN_LIST = 'REPLACE_TOKEN_LIST'
export const replaceTokenList = (_tokenList) => {
    const { activeProviders, tokenList } = _replaceTokenList(_tokenList);

    return { type: REPLACE_TOKEN_LIST, activeProviders, tokenList }
}