import { addToken as _addToken, removeToken as _removeToken } from '../utils/tokenHelper';
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