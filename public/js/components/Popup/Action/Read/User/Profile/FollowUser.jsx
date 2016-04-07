import React from 'react';
import classNames from 'classnames';

import { Action } from 'utils/api';
import { addClassTemporarily } from 'utils/dom';
import { isTwitter } from 'utils/detect';

import Icon from 'components/Utils/Icon';
class FollowBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { inprocess: false, following: props.following };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        const { inprocess, following } = this.state;
        const { uid, provider } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true });

        Action[following ? 'destroy' : 'create']({
            provider,
            action: 'follow',
            id: uid,
        })
        .then(() => {
            this.setState({ inprocess: false, following: !following });
        })
        .catch(() => {
            addClassTemporarily(this.refs.btn, 'tips--error', 500);
            this.setState({ inprocess: false });
        });
    }
    render() {
        const { inprocess, following } = this.state;
        const btnClass = classNames({
            'profile__following tips--deep': true,
            'color--twitter tips--active': following,
            'tips--inprocess': inprocess,
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.handleClick}
                ref="btn"
            >
                <Icon name="following" />
            </button>
        );
    }
}

export default props => (
    isTwitter(props.provider) ? <FollowBtn {...props} /> : <span />
);
