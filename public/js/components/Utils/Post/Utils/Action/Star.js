import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { updatePost } from '../../../../../actions/timeline';
import { Action } from '../../../../../utils/api';
import { addClassTemporarily } from '../../../../../utils/dom';

import Icon from '../../../Icon';
class Star extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false }
        this.toggleStar = this.toggleStar.bind(this)
    }
    toggleStar() {
        const { inprocess } = this.state;
        const { provider, id, stared, updatePost } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[stared ? 'destroy' : 'create']({
            action: 'star',
            provider,
            id
        })
        .then(() => updatePost({ id, payload: { stared: !stared } }))
        .catch(err => addClassTemporarily(this.refs.btn, 'tips--error', 500))
        .then(() => this.setState({ inprocess: false }))
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
                style={ id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
                ref="btn"
            >
                <Icon className={iconClass} viewBox="0 0 26 26" name="star" />
                <span className="post-action__count" />
            </button>
        );
    }
}

// Export
export default connect(null, { updatePost })(Star)