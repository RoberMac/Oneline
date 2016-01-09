import React from 'react';
import classNames from 'classnames';

import reduxStore from '../../../../../store';
import numAbbr from '../../../../../utils/numAbbr';
import { updatePost } from '../../../../../actions/timeline';
import { Action } from '../../../../../utils/api';
import { addClassTemporarily } from '../../../../../utils/dom';

import Icon from '../../../Icon';
export default class Like extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, liked: false, like_count: 0 }
        this.toggleLike = this.toggleLike.bind(this)
    }
    toggleLike() {
        const { inprocess } = this.state;
        const { provider, id } = this.props;
        const liked = this.state.liked || this.props.liked;
        const count = this.state.like_count || this.props.count;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[liked ? 'destroy' : 'create']({
            action: 'like',
            provider,
            id
        })
        .then(() => {
            const newLiked = !liked;
            const newLikeCount = count + (liked ? -1 : 1);
            reduxStore.dispatch(updatePost({
                id_str: id,
                liked: newLiked,
                like_count: newLikeCount
            }))
            this.setState({ inprocess: false, liked: newLiked, like_count: newLikeCount })
        })
        .catch(err => {
            __DEV__ && console.error(err)
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const liked = this.state.liked || this.props.liked;
        const count = this.state.like_count || this.props.count;
        const btnClass = classNames({
            'post-action tips--deep': true,
            'icon--like tips--active': liked
        });
        const iconClass = classNames({
            'post-action__icon': true,
            'animate--like': this.state.inprocess
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.toggleLike}
                style={ this.props.id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="like" />
                <span className="post-action__count" data-count={count > 0 ? numAbbr(count) : ''} />
            </button>
        );
    }
}
