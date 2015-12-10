import { isValidToken } from '../utils/tokenHelper';

const urlMatcher = (rule, url) => {
    return rule.test(url);
};

export default {
    Auth: (nextState, replaceState) => {
        if (!isValidToken()){
            replaceState(null, '/settings')
        }
    },
    HomePopup: (nextState, replaceState) => {
        console.log(nextState)
        // if (!urlMatcher(, nextState)){
        //     replaceState(null, '/')
        // }
        // reg = /^/{provider:twitter|instagram|weibo}/{action:user|tags|location}/:id?x/
    }
}