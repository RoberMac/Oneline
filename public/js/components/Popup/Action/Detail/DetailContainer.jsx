import React from 'react';

// Components
import DetailAvatar from './DetailAvatar';
import DetailActions from './DetailActions';
import DetailReply from './DetailReply';
import DetailIcon from './DetailIcon';

export default ({ provider, post, replyList, retweetedList }) => {
    let DetailComponents;

    switch (provider) {
        case 'twitter':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailActions>
                        <DetailIcon
                            name="retweet"
                            text={{ type: 'count', content: post.retweet_count }}
                            active={post.retweeted}
                        />
                        <DetailIcon
                            name="like"
                            text={{ type: 'count', content: post.like_count }}
                            active={post.liked}
                        />
                        <DetailIcon
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                        />
                    </DetailActions>

                    <DetailAvatar type="retweet" provider={provider} list={retweetedList} />
                </div>
            );
            break;
        case 'weibo':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailActions>
                        <DetailIcon
                            name="like"
                            text={{ type: 'count', content: post.like_count }}
                            active={post.liked}
                        />
                        <DetailIcon
                            name="retweet"
                            text={{ type: 'count', content: post.retweet_count }}
                            active={post.retweeted}
                        />
                        <DetailIcon
                            name="reply"
                            text={{ type: 'count', content: post.reply_count }}
                        />
                        <DetailIcon
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                        />
                    </DetailActions>
                    <DetailReply provider={provider} list={replyList} />
                </div>
            );
            break;
        default:
            break;
    }

    return DetailComponents;
};
