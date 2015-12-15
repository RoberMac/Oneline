import React from 'react';

import Icon from '../../../Icon';

export default class Reply extends React.Component {
    constructor(props) {
        super(props)
        this.reply = this.reply.bind(this)
    }
    reply() {
        // TODO
    }
    render() {
        // const { id } = this.props;

        return (
            <button className="post-action tips--deep" type="button" onClick={this.reply}>
                <Icon className="post-action__button" viewBox="0 0 26 26" name="reply" data-reply />
                <span className="post-action__count" />
            </button>
        );
    }
}