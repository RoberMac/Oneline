import React from 'react';

// Components
import DetailColumn from './DetailColumn';
import DetailRow from './DetailRow';
import DetailIcon from './DetailIcon';

export default ({ provider, post, likedList, replyList, retweetedList }) => {
    let DetailComponents;

    switch (provider) {
        case 'twitter':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailColumn>
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
                    </DetailColumn>

                    <DetailColumn type="retweet" provider={provider} list={retweetedList} />
                </div>
            );
            break;
        case 'instagram':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailColumn>
                        <DetailIcon
                            name="like"
                            text={{ type: 'count', content: post.like_count }}
                            active={post.liked}
                        />
                        <DetailIcon
                            name="reply"
                            text={{ type: 'count', content: post.reply_count }}
                        />
                        <DetailIcon
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                        />
                    </DetailColumn>

                    <DetailColumn type="like" provider={provider} list={likedList} />

                    <DetailRow provider={provider} list={replyList} />
                </div>
            );
            break;
        case 'weibo':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailColumn>
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
                    </DetailColumn>
                    <DetailRow provider={provider} list={replyList} />
                </div>
            );
            break;
        default:
            break;
    }

    return DetailComponents;
};
