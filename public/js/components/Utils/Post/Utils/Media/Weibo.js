import React from 'react';
import classNames from 'classnames';

import { handleImageError, fuckLongWeibo } from './helper.js';

// Components
import Icon from '../../../Icon';
import Spin from '../../../Spin';
import Transition from '../../../Transition';
import ViewOriginal from './Utils/ViewOriginal';

class LargeImg extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: true }
        this.handleCursorChange = this.handleCursorChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleImageLoaded = this.handleImageLoaded.bind(this)
    }
    handleCursorChange(e) {
        const elem = this.refs.largeImg;
        const offsetX = e.offsetX;
        const offsetWidth = elem.offsetWidth;
        const preCursorBound = offsetWidth * 2 / 5;
        const nextCursorBound = offsetWidth * 3 / 5;

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
    handleImageLoaded(e) {
        fuckLongWeibo(e)
        this.setState({ loading: false })
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
    componentWillReceiveProps(nextProps) {
        if (this.props.src === nextProps.src) return;
        this.setState({ loading: true })
    }
    render() {
        const { src, index, max } = this.props;
        const { loading } = this.state;
        const middleSrc = src.replace(/square|small/, 'bmiddle');
        const largeSrc  = src.replace(/square|small/, 'large');

        return (
            <div className="post-media">
                <div className="post-media__spin">
                    <Transition>
                        {loading ? <Spin isFetching={true} initLoad={true} provider="weibo" /> : null}
                    </Transition>
                </div>
                <img
                    src={middleSrc}
                    alt="weibo_large_photo"
                    onClick={this.handleClick}
                    onLoad={this.handleImageLoaded}
                    onError={handleImageError}
                    ref="largeImg"
                />
                <ViewOriginal link={largeSrc} provider="weibo" />
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
                : null
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
                    : null
                }
            </div>
        );
    }
}