import React from 'react';

import metaData from 'utils/metaData';

// Components
import Icon from 'components/Utils/Icon';
import Like from './Like';
import Reply from './Reply';
import Retweet from './Retweet';
import Source from './Source';
import Star from './Star';
import Trash from './Trash';
import Detail from './Detail';
import Share from './Share';
import Location from './Location';

const Actions = {
    twitter: ({ post }) => {
        const isAuthUser = (
            post.detail
            && metaData.get('profile_twitter') 
            && post.user.screen_name === metaData.get('profile_twitter').screen_name
        );
        return (post.detail
            ? <div>
                <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
                {isAuthUser && <Trash provider="twitter" id={post.id_str} />}
            </div>
            : <div>
                <Like provider="twitter" id={post.id_str} count={post.like_count} liked={post.liked} />
                <Retweet provider="twitter" post={post} />
                <span className="post-action__hide animate--faster">
                    <Reply provider="twitter" post={post} />
                    <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
                    <Detail provider="twitter" id={post.id_str} />
                    <Share provider="twitter" post={post} />
                </span>
            </div>
        );
    },
    instagram: ({ post }) => {
        return (post.detail
            ? <div>
                <Source provider="instagram" link={post.link} />
            </div>
            : <div>
                <Like provider="instagram" count={post.like_count} />
                <Reply provider="instagram" post={{ reply_count: post.reply_count }} />
                <span className="post-action__hide animate--faster">
                    <Source provider="instagram" link={post.link} />
                    <Detail provider="instagram" id={post.id_str} />
                    <Share provider="instagram" post={post} />
                </span>
            </div>
        );
    },
    weibo: ({ post }) => {
        const isAuthUser = (
            post.detail
            && metaData.get('profile_weibo')
            && post.user.screen_name === metaData.get('profile_weibo').screen_name
        );
        return (post.detail
            ? <div>
                <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
                {isAuthUser && <Trash provider="weibo" id={post.id_str} /> }
            </div>
            : <div>
                <Retweet provider="weibo" post={post} />
                <Reply provider="weibo" post={post} />
                <span className="post-action__hide animate--faster">
                    <Star provider="weibo" id={post.id_str} stared={post.stared} />
                    <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
                    <Detail provider="weibo" post={post} />
                    <Share provider="weibo" post={post} />
                </span>
            </div>
       );
    }
}

// Export
export default ({ post }) => {
    const SelectedActions = Actions[post.provider];
    return (
        <div>
            <span className="post-action">
                <SelectedActions post={post} />
            </span>
            {post.location && <Location provider={post.provider} {...post.location} />}
        </div>
    );
};
