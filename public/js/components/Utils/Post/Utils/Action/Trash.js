import React from 'react';
import classNames from 'classnames';

import { deletePost } from '../../../../../actions/timeline';
import reduxStore from '../../../../../store';
import { Action } from '../../../../../utils/api';
import { addClassTemporarily } from '../../../../../utils/dom';

import Icon from '../../../Icon';
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
        .then(() => reduxStore.dispatch(deletePost({ id })))
        .catch(err => {
            __DEV__ && console.error(err)
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { inprocess } = this.state;
        const { id } = this.props;
        const iconClass = classNames({
            'post-action__button': true,
            'post-action__button--inprocess': inprocess
        });
        return (
            <button
                className="post-action tips--deep"
                type="button"
                onClick={this.deletePost}
                style={ id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
                ref="btn"
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="trash" />
                <span className="post-action__count" />
            </button>
        );
    }
}
