import React from 'react';

import './post.css';

// Component
import { TwitterTweet, TwitterRetweet, TwitterQuote } from './Twitter';
import { InstagramPost } from './Instagram';
import { WeiboTweet, WeiboRetweet, WeiboQuote } from './Weibo';

// Helper
const selectPost = {
    twitter: {
        tweet: TwitterTweet,
        retweet: TwitterRetweet,
        quote: TwitterQuote
    },
    instagram: {
        post: InstagramPost
    },
    weibo: {
        tweet: WeiboTweet,
        retweet: WeiboRetweet,
        quote: WeiboQuote
    }
};

export default class Post extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        // Update only `retweeted` changed
        const prePost = this.props.item;
        const preNestPost = prePost[prePost.type];
        const nextPost = nextProps.item;
        const nextNestPost = nextPost[nextPost.type];

        return (
            prePost.retweeted !== nextPost.retweeted
            || (
                !!preNestPost && !!nextNestPost
                && preNestPost.retweeted !== nextNestPost.retweeted
            )
        );
    }
    render() {
        const { className, item, ...opts } = this.props;
        const { provider, type } = item;
        const SelectedPost = selectPost[provider][type];
        return (
            <div className={`post provider--${provider} ${className || ''}`}>
                <SelectedPost post={item} opts={opts} />
            </div>
        );
    }
}