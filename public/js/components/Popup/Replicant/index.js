import React from 'react';
import { connect } from 'react-redux';

import store from '../../../utils/store';
import { Auth } from '../../../utils/api';
import { replaceTokenList } from '../../../actions/auth';

// Components
import { addClassTemporarily } from '../../../utils/dom';
const replicantClass = 'replicant vertically_center';

class _Deckard extends React.Component {
    constructor(props) {
        super(props)
        this.getCode = this.getCode.bind(this)
    }
    getCode() {
        const { activeProviders } = this.props;
        const deckardElem = this.refs.deckard;

        this.intervals['fakeCode'] = setInterval(
            () => {
                let rdmString = ''
                for (; rdmString.length < 7; rdmString += Math.random().toString(36).substr(2));
                deckardElem.innerHTML = rdmString.substr(0, 7)
            }
        , 100)

        let profileList = [];
        activeProviders.forEach(provider => {
            let profile = store.get('profile_' + provider);
            if (profile){ profileList.push(profile) }
        });

        Auth.deckard({ profileList: JSON.stringify(profileList) })
        .then(res => {
            let deadline = 60;

            setTimeout(() => {
                clearInterval(this.intervals.fakeCode)
                deckardElem.innerHTML = res.body.code
            }, 700)

            this.intervals['countDown'] = setInterval(
                () => {
                    if (deadline < 0){
                        this.getCode()
                        deckardElem.dataset.countdown = ''
                        clearInterval(this.intervals.countDown)
                        return;
                    };
                    deckardElem.dataset.countdown = deadline--
                }
            , 1000)
        })
        .catch(err => {
            clearInterval(this.intervals.fakeCode)
            deckardElem.innerHTML = '80af294'
            deckardElem.dataset.countdown = '⟲'
        })
    }
    componentWillMount() {
        this.intervals = {
            fakeCode: 0,
            countDown: 0
        }
    }
    componentDidMount() {
        this.getCode()
    }
    componentWillUnmount() {
        Object.keys(this.intervals).forEach(key => {
            clearInterval(this.intervals[key])
        })
    }
    render() {
        return (
            <div className={replicantClass}>
                <span className="replicant--deckard" data-countdown="" ref="deckard"></span>
            </div>
        );
    }
}
class _Rachael extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()

        const { replaceTokenList, history } = this.props;
        const rachaelElem = this.refs.rachael;
        const code = rachaelElem.value;

        rachaelElem.blur()

        Auth.rachael({ code })
        .then(res => {
            if (res.body.msg.length > 0){
                res.body.msg.forEach(msg => alert(msg))
            } else {
                // 處理 Token
                replaceTokenList(res.body.tokenList)
                // 處理 Profile
                res.body.profileList.forEach(profile => {
                    store.set('profile_' + profile._provider, profile)
                })
            }

            history.push('/settings')

        })
        .catch(err => {
            console.error(err)
            addClassTemporarily(this.refs.rachael, 'replicant--rachael--errCode', 500)
        })
    }
    render() {
        return (
            <div className={replicantClass}>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="replicant--rachael"
                        type="text"
                        placeholder="80af294"
                        maxLength="7"
                        required
                        ref="rachael"
                    />
                </form>
            </div>
        );
    }
};

// Export
export const Deckard = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_Deckard)
export const Rachael = connect(
    state => ({ activeProviders: state.auth.activeProviders }),
    { replaceTokenList }
)(_Rachael)