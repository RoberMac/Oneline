import {
    addToken as _addToken,
    removeToken as _removeToken,
    replaceTokenList as _replaceTokenList,
    isValidToken as _isValidToken,
    clearTokenList as _clearTokenList,
} from 'utils/tokenHelper';
import { Auth } from 'utils/api';

// Export
export const UPDATE_TOKEN = 'UPDATE_TOKEN';


export const addToken = () => {
    const { activeProviders } = _addToken();
    return {
        type: UPDATE_TOKEN,
        payload: { activeProviders },
    };
};
export const removeToken = (provider) => {
    Auth.revoke({ provider });

    const { activeProviders } = _removeToken(provider);
    return {
        type: UPDATE_TOKEN,
        payload: { activeProviders },
    };
};
export const replaceTokenList = (_tokenList) => {
    const { activeProviders } = _replaceTokenList(_tokenList);
    return {
        type: UPDATE_TOKEN,
        payload: { activeProviders },
    };
};
export const clearTokenIfTokenExpired = () => {
    return dispatch => {
        if (!_isValidToken()) {
            const { activeProviders } = _clearTokenList();
            dispatch({
                type: UPDATE_TOKEN,
                payload: { activeProviders },
            });
        }
    };
};
