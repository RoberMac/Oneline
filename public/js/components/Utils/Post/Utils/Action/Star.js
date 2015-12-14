import React from 'react';

import Icon from '../../../Icon';

export default class Star extends React.Component {
    constructor(props) {
        super(props)
        this.star = this.star.bind(this)
    }
    star() {
        // TODO
    }
    render() {
        return (
            <button className="action tips--deep" type="button" onClick={this.star}>
                <Icon className="action__button" viewBox="0 0 26 26" name="star" data-star />
                <span className="action__count" />
            </button>
        );
    }
}