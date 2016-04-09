/* eslint no-alert: 0 */

import React from 'react';
import { browserHistory as history } from 'react-router';

// Helpers
import store from 'utils/store';
import { Auth } from 'utils/api';
import { addClassTemporarily } from 'utils/dom';
const replicantClass = 'replicant vertically_center';

// Export
export default class Rachael extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();

        const { replaceTokenList } = this.props;
        const rachaelElem = this.refs.rachael;
        const code = rachaelElem.value;

        rachaelElem.blur();

        Auth.rachael({ code })
        .then(res => {
            if (res.msg.length > 0) {
                res.msg.forEach(msg => alert(msg));
            } else {
                // 處理 Token
                replaceTokenList(res.tokenList);
                // 處理 Profile
                res.profileList.forEach(profile => {
                    store.set(`profile_${profile.provider}`, profile);
                });
            }

            history.push('/settings');
        })
        .catch(() => {
            addClassTemporarily(this.refs.rachael, 'replicant--rachael--errCode', 500);
        });
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
}
