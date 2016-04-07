import React from 'react';

// Components
import rerender from 'components/Utils/HoCs/rerender';
import { TwitterTweet, TwitterRetweet, TwitterQuote } from './Twitter';
import { WeiboTweet, WeiboRetweet, WeiboQuote } from './Weibo';
import { InstagramPost } from './Instagram';
import { UnsplashPost } from './Unsplash';

// Helpers
const selectPost = {
    twitter: {
        tweet: TwitterTweet,
        retweet: TwitterRetweet,
        quote: TwitterQuote,
    },
    instagram: {
        post: InstagramPost,
    },
    weibo: {
        tweet: WeiboTweet,
        retweet: WeiboRetweet,
        quote: WeiboQuote,
    },
    unsplash: {
        post: UnsplashPost,
    },
};

class Post extends React.Component {
    componentDidMount() {
        setTimeout(() => { this.refs.post.style.opacity = 1; });
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
                <SelectedPost {...this.props} />
            </div>
        );
    }
}
Post.displayName = 'Post';

// Export
export default rerender(Post);
