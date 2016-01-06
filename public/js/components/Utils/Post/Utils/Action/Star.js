import React from 'react';
import classNames from 'classnames';

import { updatePost } from '../../../../../actions/timeline';
import reduxStore from '../../../../../store';
import { Action } from '../../../../../utils/api';
import { addClassTemporarily } from '../../../../../utils/dom';

import Icon from '../../../Icon';
export default class Star extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.toggleStar = this.toggleStar.bind(this)
    }
    toggleStar() {
        const { inprocess } = this.state;
        const { provider, id, stared } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[stared ? 'destroy' : 'create']({
            action: 'star',
            provider,
            id
        })
        .then(() => {
            reduxStore.dispatch(updatePost({
                id_str: id,
                stared: !stared
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
        const { id, stared } = this.props;
        const btnClass = classNames({
            'post-action tips--deep': true,
            'icon--star tips--active': stared
        });
        const iconClass = classNames({
            'post-action__button': true,
            'post-action__button--inprocess': inprocess
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.toggleStar}
                style={ id ? null : { 'pointerEvents': 'none' } }
                ref="btn"
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="star" />
                <span className="post-action__count" />
            </button>
        );
    }
}
