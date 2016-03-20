import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

// Helpers
import { rewriteMediaLink } from 'utils/rewrite';

// Styles
import './common.css';

// Components
import Post from 'components/Utils/Post';
import DetailColumn from 'components/Popup/Action/Detail/DetailColumn';
import DetailIcon from 'components/Popup/Action/Detail/DetailIcon';
const DetailContainerWrapper = ({ provider, post, viewCount, sharers, children }) => (
    <div className={`detail__container provider--${provider}`}>
        <DetailColumn>
            <DetailIcon
                name="share"
                text={{ type: 'count', content: sharers.length }}
                iconCount={4}
            />
            <DetailIcon
                name="detail"
                text={{ type: 'count', content: viewCount }}
                iconCount={4}
            />
            <DetailIcon
                name="like"
                text={{ type: 'count', content: post.like_count }}
                active={post.liked}
                iconCount={4}
            />
            {children}
        </DetailColumn>

        <DetailColumn type="share" provider={provider} list={sharers} />
    </div>
);
const DetailContainer = props => {
    const { provider, post, viewCount, sharers } = props;

    let DetailComponents;
    switch (provider){
        case 'twitter':
        case 'weibo':
            DetailComponents = (
                <DetailContainerWrapper {...props}>
                    <DetailIcon
                        name="retweet"
                        text={{ type: 'count', content: post.retweet_count }}
                        active={post.retweeted}
                        iconCount={4}
                    />
                </DetailContainerWrapper>
            );
            break;
        case 'instagram':
            DetailComponents = (
                <DetailContainerWrapper {...props}>
                    <DetailIcon
                        name="reply"
                        text={{ type: 'count', content: post.reply_count }}
                        iconCount={4}
                    />
                </DetailContainerWrapper>
            );
            break;
        case 'unsplash':
            DetailComponents = (
                <DetailContainerWrapper {...props}>
                    <DetailIcon
                        name="download"
                        text={{ type: 'count', content: post.download_count }}
                        iconCount={4}
                    />
                </DetailContainerWrapper>
            );
            break;
    }

    return DetailComponents;
};
class Share extends React.Component {
    constructor(props){
        super(props)
        this.state = ({ center: true })
        this.checkDetailHeight = this.checkDetailHeight.bind(this)
    }
    checkDetailHeight() {
        if (this.refs.detail.offsetHeight < window.innerHeight && !this.POST_WITH_MEDIA) {
            this.setState({ center: true })
        } else {
            this.setState({ center: false })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.center !== nextState.center;
    }
    componentDidMount() {
        this.POST_WITH_MEDIA = (() => {
            const { data } = window.__share_data__;
            return data.media || (data.quote && data.quote.media);
        })();

        this.checkDetailHeight()
        setInterval(() => {
            this.checkDetailHeight()
        }, 1000)

        // Auto Pause All Video 
        window.addEventListener('blur', () => {
            const videos = document.getElementsByTagName('video');

            [].forEach.call(videos, video => {
                video.pause()
            });
        });
    }
    render() {
        const { data, sharers, viewCount } = window.__share_data__;
        const { provider } = data;
        const wrapperClass = classNames({
            'popup__wrapper': true,
            'vertically_center': this.state.center
        });

        return (
            <div className="oneline oneline--timeline animate--general">
                <div className="popup overflow--y">
                    <div className={wrapperClass}>
                        <div className="detail overflow--y animate--enter" ref="detail">
                            <Post
                                className="detail__post"
                                post={rewriteMediaLink({
                                    type: 'post',
                                    provider,
                                    data
                                })}
                            />
                            <DetailContainer
                                provider={provider}
                                post={data}
                                viewCount={viewCount}
                                sharers={rewriteMediaLink({
                                    type: 'sharers',
                                    provider,
                                    data: sharers
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

// Render
ReactDOM.render(
    <Share />,
    document.querySelector('.root')
);