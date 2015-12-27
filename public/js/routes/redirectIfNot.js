import { isValidToken } from '../utils/tokenHelper';

export default {
    Home: (nextState, replaceState) => {
        if (nextState.location.pathname === '/'){
            replaceState(null, '/home')
        }
    },
    Auth: (nextState, replaceState) => {
        if (!isValidToken()){
            replaceState(null, '/settings')
        }
    },
    VaildProvider: (nextState, replaceState) => {
        const provider = nextState.params.provider;
        const vaildProviders = ['twitter', 'instagram', 'weibo'];

        if (vaildProviders.indexOf(provider) < 0){
            console.error(`Warning: "${provider}" is't valid provider`)
            replaceState(null, '/home')
        }
    },
    VaildAction: (nextState, replaceState) => {
        const action = nextState.params.action;

        const validActions = ['user', 'tag', 'location', 'read', 'tweet', 'retweet', 'quote', 'reply'];
        if (validActions.indexOf(action) < 0){
            console.error(`Warning: "${action}" is't valid action`)
            replaceState(null, '/home')
        }

        const stateRequiredAction = ['retweet', 'quote', 'reply'];
        if (stateRequiredAction.indexOf(action) >= 0 && !nextState.location.state){
            console.error(`Warning: "state" is missing`)
            replaceState(null, '/home')
        }
    }
}