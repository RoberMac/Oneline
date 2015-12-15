import React from 'react';
import TimeAgo from 'react-timeago';

import formatter from './timeAgoFormatter';

export default ({ date }) => (
    <TimeAgo className="post__time" date={date} live={true} formatter={formatter}/>
);