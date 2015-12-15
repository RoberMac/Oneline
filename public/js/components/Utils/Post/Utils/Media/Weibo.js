import React from 'react';
import classNames from 'classnames';

import { handleImageError, fuckLongWeibo } from './helper.js';

// Components
import Icon from '../../../Icon';
import Empty from '../../../Empty';

class LargeImg extends React.Component {
    constructor(props) {
        super(props)
        this.handleCursorChange = this.handleCursorChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    handleCursorChange(e) {
        const elem = this.refs.largeImg;
        const offsetX = e.offsetX;
        const offsetWidth = elem.offsetWidth;
        const preCursorBound = offsetWidth * 1 / 3;
        const nextCursorBound = offsetWidth * 2 / 3;

        if (offsetX < preCursorBound){
            elem.classList.remove('cursor--next', 'cursor--zoomOut')
            elem.classList.add('cursor--pre')
        } else if (offsetX > nextCursorBound){
            elem.classList.remove('cursor--pre', 'cursor--zoomOut')
            elem.classList.add('cursor--next')
        } else {
            elem.classList.remove('cursor--pre', 'cursor--next')
            elem.classList.add('cursor--zoomOut')
        }
    }
    handleClick() {
        const { index, max, zoomIn, zoomOut } = this.props;
        const elem = this.refs.largeImg;
        const nextIndex = elem.className.search('cursor--pre') >= 0 
                            ? index - 1
                        : elem.className.search('cursor--next') >= 0 
                            ? index + 1
                        : index;

        if (nextIndex < 0 || nextIndex >= max) return;

        zoomIn(nextIndex)
    }
    componentDidMount() {
        const elem = this.refs.largeImg;

        if (this.props.max > 1){
            elem.addEventListener('mousemove', this.handleCursorChange)
        } else {
            elem.classList.add('cursor--zoomOut')
        }
    }
    componentWillUnmount() {
        const elem = this.refs.largeImg;

        if (this.props.max > 1){
            elem.removeEventListener('mousemove', this.handleCursorChange)
        }
    }
    render() {
        const { src, index, max } = this.props;
        const middleSrc = src.replace(/square|small/, 'bmiddle');
        const largeSrc  = src.replace(/square|small/, 'large');
        const originIconClass = classNames(
            'post-media__icon',
            'post-media__icon--origin',
            'icon--weibo',
            'tips--deep'
        );

        return (
            <div className="post-media">
                <img
                    src={middleSrc}
                    alt="weibo_large_photo"
                    onClick={this.handleClick}
                    onLoad={fuckLongWeibo}
                    onError={handleImageError}
                    ref="largeImg"
                />
                <a className={originIconClass} href={largeSrc} target="_blank">
                    <Icon viewBox="0 0 100 100" name="eyeball" />
                </a>
            </div>
        );
    }
};

// Export
export default class Media extends React.Component {
    constructor(props) {
        super(props)
        this.state = { largeImgSrc: '', largeImgIndex: -1 }
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
    }
    zoomIn(index, src) {
        if (index === this.state.largeImgIndex){
            this.zoomOut()
            return;
        }
        this.setState({
            largeImgSrc: src ? src : this.props.media[index].image_url,
            largeImgIndex: index
        })
    }
    zoomOut() {
        this.setState({ largeImgSrc: '', largeImgIndex: -1 })
    }
    render() {
        const { media } = this.props;
        const { largeImgSrc, largeImgIndex } = this.state;
        const thumbWrapperClass = classNames({
            'post-media--small': largeImgIndex >= 0,
            'post-media post-media--thumb overflow--x cursor--zoomIn': true
        });

        return (
            <div>
                {media.length !== 1 || largeImgIndex < 0
                    ? (
                        <div className={thumbWrapperClass}>
                        {media.map((item, index)=> {
                            const thumbClass = classNames({
                                'post-media--gif': item.type === 'gif',
                                'post-media--active cursor--zoomOut': index === largeImgIndex,
                                'post-media--inactive': largeImgIndex >= 0 && index !== largeImgIndex,
                                'animate--faster': true
                            });
                            return (
                                <img
                                    key={index}
                                    className={thumbClass}
                                    src={item.image_url}
                                    onClick={this.zoomIn.bind(this, index, item.image_url)}
                                />
                            );
                        })}
                        </div>
                    )
                : <Empty />
                }

                { largeImgSrc 
                        ? (
                            <LargeImg
                                src={largeImgSrc}
                                index={largeImgIndex}
                                max={media.length}
                                zoomIn={this.zoomIn}
                                zoomOut={this.zoomOut}
                            /> 
                        )
                    : <Empty />
                }
            </div>
        );
    }
}