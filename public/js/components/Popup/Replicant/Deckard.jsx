import React from 'react';

import store from 'utils/store';
import { Auth } from 'utils/api';

export default class Deckard extends React.Component {
    constructor(props) {
        super(props);
        this.getCode = this.getCode.bind(this);
    }
    componentWillMount() {
        this.intervals = {
            fakeCode: 0,
            countDown: 0,
        };
    }
    componentDidMount() {
        this.getCode();
    }
    componentWillUnmount() {
        Object.keys(this.intervals).forEach(key => {
            clearInterval(this.intervals[key]);
        });
    }
    getCode() {
        const { activeProviders } = this.props;
        const deckardElem = this.refs.deckard;

        this.intervals.fakeCode = setInterval(
            () => {
                let rdmString = '';
                for (; rdmString.length < 7; rdmString += Math.random().toString(36).substr(2));
                deckardElem.innerHTML = rdmString.substr(0, 7);
            }
        , 100);

        const profileList = [];
        activeProviders.forEach(provider => {
            const profile = store.get.profile + provider;
            if (profile) profileList.push(profile);
        });

        Auth.deckard({ profileList })
        .then(res => {
            let deadline = 60;

            setTimeout(() => {
                clearInterval(this.intervals.fakeCode);
                deckardElem.innerHTML = res.code;
            }, 700);

            this.intervals.countDown = setInterval(
                () => {
                    if (deadline < 0) {
                        this.getCode();
                        deckardElem.dataset.countdown = '';
                        clearInterval(this.intervals.countDown);
                        return;
                    }
                    deckardElem.dataset.countdown = deadline--;
                }
            , 1000);
        })
        .catch(() => {
            clearInterval(this.intervals.fakeCode);
            deckardElem.innerHTML = '80af294';
            deckardElem.dataset.countdown = '⟲';
        });
    }
    render() {
        return (
            <div className="replicant vertically_center" onClick={e => e.stopPropagation()}>
                <span className="replicant--deckard" data-countdown="" ref="deckard"></span>
            </div>
        );
    }
}
