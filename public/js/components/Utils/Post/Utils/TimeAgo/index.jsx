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
        const dateTime = new Date(date).toISOString();
        const localeDate = new Date(date).toLocaleString();
        const timeClass = `post__time tips--deep ${className || ''}`;

        return (
            <span className={timeClass} onClick={this.toggleTimeAgo}>
            {this.state.isTimeAge
                ? <TimeAgo
                    component="time"
                    dateTime={dateTime}
                    date={date}
                    formatter={formatter}
                    maxPeriod={60}
                    live
                />
                : <time dateTime={dateTime}>{localeDate}</time>
            }
            </span>
        );
    }
}
