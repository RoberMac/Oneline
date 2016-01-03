import React from 'react';
import TimeAgo from 'react-timeago';

import formatter from './timeAgoFormatter';

export default class _TimeAgo extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isTimeAge: true }
        this.toggleTimeAgo = this.toggleTimeAgo.bind(this)
    }
    toggleTimeAgo() {
        this.setState({ isTimeAge: !this.state.isTimeAge })
    }
    render() {
        const { date } = this.props;
        return (
            <span className="post__time" onClick={this.toggleTimeAgo}>
            {this.state.isTimeAge
                ? <TimeAgo date={date} live={true} formatter={formatter}/>
                : <span>{new Date(date).toLocaleString()}</span>
            }
            </span>
        );
    }
}