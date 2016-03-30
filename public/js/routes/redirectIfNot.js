import { isValidToken } from '../utils/tokenHelper';

// Helerps
import reduxStore from 'state/store';
import { UPDATE_TOKEN } from 'state/actions/auth';
let { activeProviders } = reduxStore.getState().auth;
reduxStore.subscribe(() => {
    const { auth, lastAction: { type } } = reduxStore.getState();

    if (type !== UPDATE_TOKEN) return;

    ({ activeProviders } = auth);
})

// Export
export default {
    Home: (nextState, replaceState) => {
        if (nextState.location.pathname === '/'){
            replaceState('/home')
        }
    },
    Auth: (nextState, replaceState) => {
        if (!isValidToken()){
            replaceState('/settings')
        }
    },
    VaildProvider: (nextState, replaceState) => {
        const provider = nextState.params.provider;
        const vaildProviders = ['twitter', 'instagram', 'weibo', 'unsplash'];

        if (!~vaildProviders.indexOf(provider) || !~activeProviders.indexOf(provider)){
            __DEV__ && console.error(`Warning: "${provider}" is't valid provider`)
            replaceState('/home')
        }
    },
    VaildAction: (nextState, replaceState) => {
        const action = nextState.params.action;

        const validActions = [
            'user', 'tags', 'locations', 
            'read', 'tweet', 'retweet', 'quote', 'reply',
            'detail', 'share', 'search',
        ];
        if (!~validActions.indexOf(action)){
            __DEV__ && console.error(`Warning: "${action}" is't valid action`)
            replaceState('/home')
        }

        const stateRequiredAction = ['retweet', 'quote', 'reply', 'share'];
        if (~stateRequiredAction.indexOf(action) && !nextState.location.state){
            __DEV__ && console.error(`Warning: "state" is missing`)
            replaceState('/home')
        }
    }
}