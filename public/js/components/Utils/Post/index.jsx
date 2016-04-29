import React from 'react';
import assign from 'object.assign';

// Components
import rerender from 'components/Utils/HoCs/ReRender';
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
        const { className, post, style } = this.props;
        const { provider, type } = post;
        const SelectedPost = selectPost[provider][type];

        return (
            <article
                className={`post animate--faster provider--${provider} ${className || ''}`}
                style={assign({ opacity: 0 }, style)}
                ref="post"
            >
                <SelectedPost {...this.props} />
            </article>
        );
    }
}
Post.displayName = 'Post';

// Export
export default rerender(Post);
