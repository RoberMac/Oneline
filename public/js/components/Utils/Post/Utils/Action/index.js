import React from 'react';

// Components
import Like from './Like';
import Reply from './Reply';
import Retweet from './Retweet';
import Source from './Source';
import Star from './Star';
import Trash from './Trash';
import Location from './Location';
import Detail from './Detail';

// Export
export const TwitterAction = ({ post, opts }) => {
    const isAuthUser = opts.isDetailPost && post.user.screen_name === window.profile_twitter.screen_name
    const Actions = opts.isDetailPost ? (
        <span className="cursor--pointer">
            <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
            {isAuthUser ? <Trash provider="twitter" id={post.id_str} /> : null}
            {post.location ? <Location provider="twitter" {...post.location} /> : null}
        </span>
    ) : (
        <span className="cursor--pointer">
            <Like provider="twitter" id={post.id_str} count={post.like_count} liked={post.liked} />
            <Retweet provider="twitter" post={post} />
            <Reply provider="twitter" post={post} />
            <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
            <Detail provider="twitter" id={post.id_str} />
            {post.location ? <Location provider="twitter" {...post.location} /> : null}
        </span>
    );

    return Actions;
};
export const InstagramAction = ({ post, opts }) => {
    const Actions = opts.isDetailPost ? (
        <span className="cursor--pointer">
            <Source provider="instagram" link={post.link} />
            {post.location ? <Location provider="instagram" {...post.location} /> : null}
        </span>
    ) : (
        <span className="cursor--pointer">
            <Like provider="instagram" count={post.like_count} />
            <Reply provider="instagram" post={{ reply_count: post.reply_count }} />
            <Source provider="instagram" link={post.link} />
            <Detail provider="instagram" id={post.id_str} />
            {post.location ? <Location provider="instagram" {...post.location} /> : null}
        </span>
    );

    return Actions;
};
export const WeiboAction = ({ post, opts }) => {
    const isAuthUser = opts.isDetailPost && post.user.screen_name === window.profile_weibo.screen_name;
    const Actions = opts.isDetailPost ? (
        <span className="cursor--pointer">
            <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
            <Star provider="weibo" id={post.id_str} stared={post.stared} />
            {post.location ? <Location provider="weibo" {...post.location} /> : null}
            {isAuthUser ? <Trash provider="weibo" id={post.id_str} /> : null}
        </span>
    ) : (
        <span className="cursor--pointer">
            <Retweet provider="weibo" post={post} />
            <Reply provider="weibo" post={post} />
            <Star provider="weibo" id={post.id_str} stared={post.stared} />
            <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
            <Detail provider="weibo" post={post} />
            {post.location ? <Location provider="weibo" {...post.location} /> : null}
        </span>
    );

    return Actions;
};
