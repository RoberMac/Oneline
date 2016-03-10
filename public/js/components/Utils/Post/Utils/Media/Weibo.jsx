import React from 'react';
import classNames from 'classnames';
import ClassList from 'classlist';

// Helpers
import { handleImageError, fuckLongWeibo } from './helper.js';

// Components
import Icon from 'components/Utils/Icon';
import Spin from 'components/Utils/Spin';
import Transition from 'components/Utils/Transition';
import ViewOriginal from './Utils/ViewOriginal';

class LargeImg extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: true }
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleImageLoaded = this.handleImageLoaded.bind(this)
        this.getBound = this.getBound.bind(this)
    }
    handleMouseMove(e) {
        const { index, count } = this.props;

        if (count <= 1) return;

        this.imgClassList.remove('cursor--pre', 'cursor--next', 'cursor--zoomOut');
        switch (this.getBound(e)) {
            case 'left':
                if (index === 0) return;
                this.imgClassList.add('cursor--pre');
                break;
            case 'right':
                if (index === count - 1) return;
                this.imgClassList.add('cursor--next')
                break;
            case 'center':
                this.imgClassList.add('cursor--zoomOut')
                break;
        }
    }
    handleClick(e) {
        if (/a|svg|use/i.test(e.target.tagName)) return;

        const { index, count, onZoom } = this.props;

        let nextIndex;
        switch (this.getBound(e)) {
            case 'left':
                nextIndex = index - 1;
                break;
            case 'right':
                nextIndex = index + 1;
                break;
            case 'center':
                nextIndex = index;
                break;
        }

        if (count === 1) nextIndex = index;
        if (nextIndex < 0 || nextIndex >= count) return;
        if (count === 1) {
            nextIndex = index;
        }

        onZoom(nextIndex)
    }
    handleImageLoaded(e) {
        fuckLongWeibo(e)
        this.setState({ loading: false })
    }
    getBound(e) {
        const imgWidth = this.refs.largeImg.offsetWidth;
        const BOUND = {
            preCursorBound: imgWidth * 2 / 5,
            nextCursorBound: imgWidth * 3 / 5
        };
        const X = e.clientX - (window.innerWidth - imgWidth) / 2;

        if (X < BOUND.preCursorBound) {
            return 'left';
        } else if (X > BOUND.nextCursorBound) {
            return 'right';
        } else {
            return 'center';
        }
    }
    componentDidMount() {
        this.imgClassList = new ClassList(this.refs.largeImg);

        this.props.count <= 1 && this.imgClassList.add('cursor--zoomOut')
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.src === nextProps.src) return;
        this.setState({ loading: true })
    }
    render() {
        const { src } = this.props;
        const { loading } = this.state;
        const middleSrc = src.replace(/square|small/, 'bmiddle');
        const largeSrc  = src.replace(/square|small/, 'large');

        return (
            <div
                className="post-media"
                onClick={this.handleClick}
                onMouseMove={this.handleMouseMove}
                ref="largeImg"
                role="button"
            >
                <div className="post-media__spin">
                    <Transition>
                        {loading && <Spin isFetching={true} initLoad={true} provider="weibo" />}
                    </Transition>
                </div>
                <img
                    src={middleSrc}
                    onLoad={this.handleImageLoaded}
                    onError={handleImageError}
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
        this.handleZoom = this.handleZoom.bind(this)
    }
    handleZoom(index, src) {
        // Zoom Out
        if (index === this.state.largeImgIndex){
            this.setState({ largeImgSrc: '', largeImgIndex: -1 })
        }
        // Zoom In
        else {
            this.setState({
                largeImgSrc: src ? src : this.props.media[index].image_url,
                largeImgIndex: index
            })
        }
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
            {(media.length !== 1 || largeImgIndex < 0) && (
                <div className={thumbWrapperClass}>
                {media.map((item, index)=> {
                    const thumbClass = classNames({
                        'post-media--gif': item.type === 'gif',
                        'post-media--active cursor--zoomOut': index === largeImgIndex,
                        'post-media--inactive': largeImgIndex >= 0 && index !== largeImgIndex,
                        'animate--faster': true
                    });
                    return <img
                        key={index}
                        className={thumbClass}
                        src={item.image_url}
                        onClick={this.handleZoom.bind(this, index, item.image_url)}
                    />;
                })}
                </div>
            )}

            {largeImgSrc && (
                <LargeImg
                    src={largeImgSrc}
                    index={largeImgIndex}
                    count={media.length}
                    onZoom={this.handleZoom}
                /> 
            )}
            </div>
        );
    }
}