import React from 'react';
import TimeAgo from 'react-timeago';

import formatter from './timeAgoFormatter';

export default class _TimeAgo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isTimeAge: true };
        this.toggleTimeAgo = this.toggleTimeAgo.bind(this);
    }
    toggleTimeAgo() {
        this.setState({ isTimeAge: !this.state.isTimeAge });
    }
    render() {
        const { date, className } = this.props;
        return (
            <span className={`post__time tips ${className || ''}`} onClick={this.toggleTimeAgo}>
            {this.state.isTimeAge
                ? <TimeAgo date={date} live formatter={formatter} maxPeriod={60} />
                : <span>{new Date(date).toLocaleString()}</span>
            }
            </span>
        );
    }
}
