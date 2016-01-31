import React from 'react';

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

const ShowCountlessActions = ({ name, onClick }) => (
    <button className="post-action__btn tips--deep" type="button" onClick={onClick}>
        <Icon className="post-action__icon" viewBox="0 0 50 50" name={name} />
        <span className="post-action__count" />
    </button>
);
const Actions = {
    twitter: ({ post, onClick, showCountlessActions }) => {
        const isAuthUser = (
            post.detail
            && window.profile_twitter 
            && post.user.screen_name === window.profile_twitter.screen_name
        );
        return (post.detail
            ? <div>
                <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
                {isAuthUser ? <Trash provider="twitter" id={post.id_str} /> : null}
            </div>
            : showCountlessActions
                ? <div>
                    <Like provider="twitter" id={post.id_str} count={post.like_count} liked={post.liked} />
                    <Retweet provider="twitter" post={post} />
                    <Reply provider="twitter" post={post} />
                    <Source provider="twitter" screen_name={post.user.screen_name} id={post.id_str} />
                    <Detail provider="twitter" id={post.id_str} />
                    <Share provider="twitter" post={post} />
                </div>
            : <div>
                <Like provider="twitter" id={post.id_str} count={post.like_count} liked={post.liked} />
                <Retweet provider="twitter" post={post} />
                <Reply provider="twitter" post={post} />
                <ShowCountlessActions name="triangle" onClick={onClick} />
            </div>
        );
    },
    instagram: ({ post, onClick, showCountlessActions }) => {
        return (post.detail
            ? <div>
                <Source provider="instagram" link={post.link} />
            </div>
            : showCountlessActions
                ? <div>
                    <Like provider="instagram" count={post.like_count} />
                    <Reply provider="instagram" post={{ reply_count: post.reply_count }} />
                    <Source provider="instagram" link={post.link} />
                    <Detail provider="instagram" id={post.id_str} />
                    <Share provider="instagram" post={post} />
                </div>
            : <div>
                <Like provider="instagram" count={post.like_count} />
                <Reply provider="instagram" post={{ reply_count: post.reply_count }} />
                <ShowCountlessActions name="triangle" onClick={onClick} />
            </div>
        );
    },
    weibo: ({ post, onClick, showCountlessActions }) => {
        const isAuthUser = (
            post.detail
            && window.profile_weibo
            && post.user.screen_name === window.profile_weibo.screen_name
        );
        return (post.detail
            ? <div>
                <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
                {isAuthUser ? <Trash provider="weibo" id={post.id_str} /> : null}
            </div>
            : showCountlessActions
                ? <div>
                    <Retweet provider="weibo" post={post} />
                    <Reply provider="weibo" post={post} />
                    <Star provider="weibo" id={post.id_str} stared={post.stared} />
                    <Source provider="weibo" uid={post.user.uid} mid={post.mid} />
                    <Detail provider="weibo" post={post} />
                    <Share provider="weibo" post={post} />
                </div>
            : <div>
                <Retweet provider="weibo" post={post} />
                <Reply provider="weibo" post={post} />
                <ShowCountlessActions name="rect" onClick={onClick} />
            </div>
        );
    }
}

// Export
export default class index extends React.Component {
    constructor(props) {
        super(props)
        this.state = { showCountlessActions: false }
        this.showCountlessActions = this.showCountlessActions.bind(this)
    }
    showCountlessActions() {
        this.setState({ showCountlessActions: true })
    }
    render() {
        const { post } = this.props;
        const SelectedActions = Actions[post.provider];
        return (
            <div>
                <span className="post-action">
                    <SelectedActions
                        post={post}
                        showCountlessActions={this.state.showCountlessActions}
                        onClick={this.showCountlessActions}
                    />
                </span>
                {post.location ? <Location provider={post.provider} {...post.location} /> : null}
            </div>
        );
    }
};
