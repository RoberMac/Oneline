import React from 'react';
import classNames from 'classnames';

import { lazySize } from '../helper.js';

import Icon from '../../../../Icon';

export default class Video extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isPlaying: false }
        this.togglePlay = this.togglePlay.bind(this)
    }
    togglePlay() {
        const videoElem = this.refs.video;
        const isPlaying = this.state.isPlaying;

        videoElem.paused ?  videoElem.play() : videoElem.pause()
        this.setState({ isPlaying: !isPlaying })
    }
    render() {
        const { src, poster, ratio } = this.props;
        const { isPlaying } = this.state;

        const playBtnClass = classNames({
            'post-media__playButton animate--faster': true,
            'post-media__playButton--playing': isPlaying
        })

        return (
            <div className="post-media--large" style={lazySize(ratio)} onClick={this.togglePlay}>
                <video
                    src={src}
                    poster={poster}
                    preload="none"
                    webkit-playsinline="true"
                    loop
                    ref="video"
                />
                <Icon className={playBtnClass} viewBox="0 0 100 100" name="play" />
            </div>
        );
    }
}