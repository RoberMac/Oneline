import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { lazySize } from '../helper.js';

import Icon from 'components/Utils/Icon';

export default class Video extends React.Component {
    constructor(props) {
        super(props)
        this.setPlayState = this.setPlayState.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.handlePlayStateChange = this.handlePlayStateChange.bind(this)
    }
    setPlayState(isPlay) {
        const videoElem = this.refs.video;
        isPlay ? videoElem.play() : videoElem.pause();
    }
    togglePlay() {
        const isPlaying = !this.refs.video.paused;
        this.setPlayState(!isPlaying)
    }
    handlePlayStateChange(isPlay) {
        this.refs.video
        .nextSibling
        .classList[isPlay ? 'add' : 'remove']('post-media__playBtn--playing')
    }
    render() {
        const { src, poster, ratio } = this.props;
        return (
            <VisibilitySensor onChange={isVisible => isVisible ? null : this.setPlayState(false)}>
                <div
                    className="post-media--large"
                    style={lazySize(ratio)}
                    onClick={this.togglePlay}
                >
                    <video
                        src={src}
                        poster={poster}
                        preload="none"
                        webkit-playsinline="true"
                        loop
                        ref="video"
                        onPlay={() => this.handlePlayStateChange(true)}
                        onPause={() => this.handlePlayStateChange(false)}
                    />
                    <Icon className="post-media__playBtn animate--faster" name="triangle" />
                </div>
            </VisibilitySensor>
        );
    }
}