import React from 'react';

import Icon from '../../../Icon';

export default class Like extends React.Component {
    constructor(props) {
        super(props)
        this.toggleLike = this.toggleLike.bind(this)
    }
    toggleLike() {
        // TODO
    }
    render() {
        const { id, count } = this.props;
        // const { count, id } = this.props;

        return (
            <button
                className="post-action tips--deep"
                type="button"
                onClick={this.toggleLike}
                style={ id ? null : { 'pointerEvents': 'none' } }
            >
                <Icon className="post-action__button" viewBox="0 0 26 26" name="favorite" data-like />
                <span
                    className="post-action__count"
                    data-count={count > 0 ? count : ''}
                />
            </button>
        );
    }
}