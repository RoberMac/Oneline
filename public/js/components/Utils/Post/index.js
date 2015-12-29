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


export default ({ item }) => {
    const { provider, type } = item;
    const SelectedPost = selectPost[provider][type];

    return <SelectedPost {...item} />
}