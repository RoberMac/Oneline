import React from 'react';

import Icon from '../../../Icon';

export default class Retweet extends React.Component {
    constructor(props) {
        super(props)
        this.retweet = this.retweet.bind(this)
    }
    retweet() {
        // TODO
    }
    render() {
        const { retweet_count } = this.props;
        // const { id } = this.props;

        return (
            <button className="action tips--deep" type="button" onClick={this.retweet}>
                <Icon className="action__button" viewBox="0 0 34 26" name="retweet" data-retweet />
                <span
                    className="action__count"
                    data-count={retweet_count > 0 ? retweet_count : ''}
                />
            </button>
        );
    }
}