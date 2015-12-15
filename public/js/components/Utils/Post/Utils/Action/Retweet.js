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
        const { count } = this.props;
        // const { id } = this.props;

        return (
            <button className="post-action tips--deep" type="button" onClick={this.retweet}>
                <Icon className="post-action__button" viewBox="0 0 34 26" name="retweet" data-retweet />
                <span
                    className="post-action__count"
                    data-count={count > 0 ? count : ''}
                />
            </button>
        );
    }
}