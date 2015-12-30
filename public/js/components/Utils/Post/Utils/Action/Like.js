import React from 'react';
import classNames from 'classnames';

import { updatePost } from '../../../../../actions/timeline';
import reduxStore from '../../../../../store';
import { Action } from '../../../../../utils/api';
import { addClassTemporarily } from '../../../../../utils/dom';

import Icon from '../../../Icon';
export default class Like extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.toggleLike = this.toggleLike.bind(this)
    }
    toggleLike() {
        const { inprocess } = this.state;
        const { provider, id, count, liked } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[liked ? 'destroy' : 'create']({
            action: 'like',
            provider,
            id
        })
        .then(() => {
            reduxStore.dispatch(updatePost({
                id_str: id,
                liked: !liked,
                like_count: count + (liked ? -1 : 1)
            }))
            this.setState({ inprocess: false })
        })
        .catch(err => {
            __DEV__ && console.error(err)
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { inprocess } = this.state;
        const { id, count, liked } = this.props;
        const btnClass = classNames({
            'post-action tips--deep': true,
            'icon--like tips--active': liked
        });
        const iconClass = classNames({
            'post-action__button': true,
            'post-action__button--inprocess': inprocess
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.toggleLike}
                style={ id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="favorite" />
                <span className="post-action__count" data-count={count > 0 ? count : ''} />
            </button>
        );
    }
}
