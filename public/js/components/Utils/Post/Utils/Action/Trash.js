import React from 'react';
import classNames from 'classnames';

import reduxStore from 'store';
import history from 'utils/history';
import { deletePost } from 'actions/timeline';
import { Action } from 'utils/api';
import { addClassTemporarily } from 'utils/dom';

import Icon from 'components/Utils/Icon';
export default class Trash extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.deletePost = this.deletePost.bind(this)
    }
    deletePost() {
        const { inprocess } = this.state;
        const { provider, id } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action
        .destroy({ action: 'tweet', provider, id })
        .then(() => {
            reduxStore.dispatch(deletePost({ id }))
            history.push('/home')
        })
        .catch(err => {
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { inprocess } = this.state;
        const { id } = this.props;
        const btnClass = classNames({
            'post-action__btn tips--deep': true,
            'tips--inactive': !id
        });
        const iconClass = classNames({
            'post-action__icon': true,
            'animate--trash': inprocess
        });
        return (
            <button className={btnClass} type="button" onClick={this.deletePost} ref="btn">
                <Icon className={iconClass} name="trash" />
                <span className="post-action__count" />
            </button>
        );
    }
}
