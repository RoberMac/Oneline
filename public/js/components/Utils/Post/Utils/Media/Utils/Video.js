import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { lazySize } from '../helper.js';

import Icon from '../../../../Icon';

export default class Video extends React.Component {
    constructor(props) {
        super(props)
        this.setPlayState = this.setPlayState.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    }
    setPlayState(isPlay) {
        const videoElem = this.refs.video;
        const playBtn = videoElem.nextSibling;

        if (isPlay){
            videoElem.play()
            playBtn.classList.add('post-media__playBtn--playing')
        } else {
            videoElem.pause()
            playBtn.classList.remove('post-media__playBtn--playing')
        }
    }
    togglePlay() {
        const isPlaying = !this.refs.video.paused;
        this.setPlayState(!isPlaying)
    }
    handleVisibilityChange(isVisible) {
        if (!isVisible) {
            this.setPlayState(false)
        };
    }
    render() {
        const { src, poster, ratio } = this.props;
        return (
            <VisibilitySensor onChange={this.handleVisibilityChange}>
                <div className="post-media--large" style={lazySize(ratio)} onClick={this.togglePlay}>
                    <video
                        src={src}
                        poster={poster}
                        preload="none"
                        webkit-playsinline="true"
                        loop
                        ref="video"
                    />
                    <Icon
                        className='post-media__playBtn animate--faster'
                        viewBox="0 0 100 100"
                        name="play"
                    />
                </div>
            </VisibilitySensor>
        );
    }
}