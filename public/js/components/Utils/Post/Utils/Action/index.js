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
export const TwitterAction = ({ post, opts }) => (
    <span className="cursor--pointer">
        <Like
            provider="twitter"
            id={post.id_str}
            count={post.like_count}
            liked={post.liked}
        />
        <Retweet provider="twitter" post={post} />
        <Reply provider="twitter" post={post} />
        <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
        <Detail provider="twitter" post={post} />

        {post.location ? <Location provider="twitter" {...post.location} /> : null}

        {opts.isDetailPost && post.user.screen_name === window.profile_twitter.screen_name
            ? <Trash provider="twitter" id={post.id_str} />
            : null
        }
    </span>
);
export const InstagramAction = ({ post, opts }) => (
    <span className="cursor--pointer">
        <Source provider="instagram" link={post.link} />
        <Like provider="instagram" count={post.like_count} />
        <Reply provider="instagram" post={{ reply_count: post.reply_count }} />
        <Detail provider="instagram" post={post} />

        {post.location ? <Location provider="instagram" {...post.location} /> : null}
    </span>
);
export const WeiboAction = ({ post, opts }) => (
    <span className="cursor--pointer">
        <Retweet provider="weibo" post={post} />
        <Reply provider="weibo" post={post} />
        <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
        <Star provider="weibo" id={post.id_str} stared={post.stared} />
        <Detail provider="weibo" post={post} />

        {post.location ? <Location provider="weibo" {...post.location} /> : null}

        {opts.isDetailPost && post.user.screen_name === window.profile_weibo.screen_name
            ? <Trash provider="weibo" id={post.id_str} />
            : null
        }
        {opts.isDetailPost && post.like_count
            ? <Like count={post.like_count} liked={post.liked} />
            : null
        }
    </span>
);
