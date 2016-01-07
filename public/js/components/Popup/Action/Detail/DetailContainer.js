import React from 'react';

// Components
import DetailColumn from './DetailColumn';
import DetailRow from './DetailRow';
import DetailIcon from './DetailIcon';

export default ({ provider, post, likedList, replyList, retweetedList }) => {
    let DetailComponents;

    switch (provider){
        case 'twitter':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailColumn provider={provider}>
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="like"
                            text={{ type: 'count', content: post.like_count } }
                            iconCount={3}
                        />
                        <DetailIcon
                            viewBox="0 0 34 26"
                            name="retweet"
                            text={{ type: 'count', content: post.retweet_count }}
                            iconCount={3}
                        />
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                            iconCount={3}
                        />
                    </DetailColumn>

                    <DetailColumn type="retweet" provider={provider} list={retweetedList} />
                </div>
            );
            break;
        case 'instagram':
            DetailComponents = (
                <div className={`detail__container provider--${provider}`}>
                    <DetailColumn provider={provider}>
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="like"
                            text={{ type: 'count', content: post.like_count }}
                            iconCount={3}
                        />
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="reply"
                            text={{ type: 'count', content: post.reply_count }}
                            iconCount={3}
                        />
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                            iconCount={3}
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
                    <DetailColumn provider={provider}>
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="like"
                            text={{ type: 'count', content: post.like_count }}
                            iconCount={4}
                        />
                        <DetailIcon
                            viewBox="0 0 34 26"
                            name="retweet"
                            text={{ type: 'count', content: post.retweet_count }}
                            iconCount={4}
                        />
                        <DetailIcon
                            viewBox="0 0 34 26"
                            name="reply"
                            text={{ type: 'count', content: post.reply_count }}
                            iconCount={4}
                        />
                        <DetailIcon
                            viewBox="0 0 26 26"
                            name="calendar"
                            text={{ type: 'date', content: post.created_at }}
                            iconCount={4}
                        />
                    </DetailColumn>
                    <DetailRow provider={provider} list={replyList} />
                </div>
            );
            break;
    }

    return DetailComponents;
};