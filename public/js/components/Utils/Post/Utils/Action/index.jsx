import React from 'react';

// Helpers
import reduxStore from 'state/store';
import { UPDATE_BASE } from 'state/actions/base';

// State Handing
let PROFILE = reduxStore.getState().base.get('PROFILE');
reduxStore.subscribe(() => {
    const { base, lastAction: { type } } = reduxStore.getState();

    if (type !== UPDATE_BASE) return;

    PROFILE = base.get('PROFILE');
})

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
import Download from './Download';

const Actions = {
    twitter: ({ post }) => {
        const isAuthUser = (
            post.detail
            && PROFILE && PROFILE['twitter'] 
            && post.user.screen_name === PROFILE['twitter'].screen_name
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
            && PROFILE && PROFILE['weibo']
            && post.user.screen_name === PROFILE['weibo'].screen_name
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
    },
    unsplash: ({ post }) => {
        return (post.detail
            ? <div>
                <Source provider="unsplash" id={post.id_str} />
            </div>
            : <div>
                <Like provider="unsplash" id={post.id_str} count={post.like_count} liked={post.liked} />
                <span className="post-action__hide animate--faster">
                    <Download provider="unsplash" id={post.id_str} count={post.download_count} />
                    <Source provider="unsplash" id={post.id_str} />
                    <Share provider="unsplash" post={post} />
                </span>
            </div>
        );
    }
};

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
