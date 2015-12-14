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
        const { favorite_count } = this.props;
        // const { favorite_count, id } = this.props;

        return (
            <button
                className="action tips--deep"
                type="button"
                onClick={this.toggleLike}
            >
                <Icon className="action__button" viewBox="0 0 26 26" name="favorite" data-like />
                <span
                    className="action__count"
                    data-count={favorite_count > 0 ? favorite_count : ''}
                />
            </button>
        );
    }
}