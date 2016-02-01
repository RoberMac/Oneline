import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

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
        const shouldUpdate = shallowCompare(this, nextProps, nextState);
        __DEV__ && shouldUpdate && console.log(`[PostUpdate]: ${nextProps.post.id_str}`)
        return shouldUpdate;
    }
    componentDidMount() {      
        setTimeout(() => this.refs.post.style.opacity = 1)        
    }
    render() {
        const { className, post } = this.props;
        const { provider, type } = post;
        const SelectedPost = selectPost[provider][type];
        return (
            <div
                className={`post animate--faster provider--${provider} ${className || ''}`}
                style={{ opacity: 0 }}
                ref="post"
            >
                <SelectedPost post={post} />
            </div>
        );
    }
}