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
        this.state = { inprocess: false, stared: false }
        this.toggleStar = this.toggleStar.bind(this)
    }
    toggleStar() {
        const { inprocess } = this.state;
        const { provider, id } = this.props;
        const stared = this.state.stared || this.props.stared;

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
            this.setState({ inprocess: false, stared: !stared })
        })
        .catch(err => {
            __DEV__ && console.error(err)
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const stared = this.state.stared || this.props.stared;
        const btnClass = classNames({
            'post-action tips--deep': true,
            'icon--star tips--active': stared
        });
        const iconClass = classNames({
            'post-action__icon': true,
            'animate--star': this.state.inprocess
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.toggleStar}
                style={ this.props.id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
                ref="btn"
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="star" />
                <span className="post-action__count" />
            </button>
        );
    }
}
