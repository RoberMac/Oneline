import React from 'react';
import classNames from 'classnames';

import reduxStore from 'state/store';
import numAbbr from 'utils/numAbbr';
import { updatePost } from 'state/actions/timeline';
import { Action } from 'utils/api';
import { addClassTemporarily } from 'utils/dom';

import Icon from 'components/Utils/Icon';
export default class Like extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, liked: props.liked, like_count: props.count }
        this.toggleLike = this.toggleLike.bind(this)
    }
    toggleLike() {
        const { inprocess, liked, like_count } = this.state;
        const { provider, id } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[liked ? 'destroy' : 'create']({
            action: 'like',
            provider,
            id
        })
        .then(() => {
            const newLiked = !liked;
            const newLikeCount = like_count + (liked ? -1 : 1);
            reduxStore.dispatch(updatePost({
                id_str: id,
                liked: newLiked,
                like_count: newLikeCount
            }))
            this.setState({ inprocess: false, liked: newLiked, like_count: newLikeCount })
        })
        .catch(err => {
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { liked, like_count } = this.state;
        const btnClass = classNames({
            'post-action__btn tips--deep': true,
            'color--like tips--active': liked,
            'color--steel': !liked,
            'tips--inactive': !this.props.id
        });
        const iconClass = classNames({
            'post-action__icon': true,
            'animate--like': this.state.inprocess
        });
        return (
            <button className={btnClass} onClick={this.toggleLike} type="button" ref="btn">
                <Icon className={iconClass} name="like" />
                <span className="post-action__count" data-count={like_count > 0 ? numAbbr(like_count) : ''} />
            </button>
        );
    }
}
