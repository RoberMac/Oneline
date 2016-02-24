import React from 'react';
import classNames from 'classnames';
import ClassList from 'classlist';

// Helpers
import { handleImageError, fuckLongWeibo } from './helper.js';
import reduxStore from 'state/store';
import { UPDATE_BASE } from 'state/actions/base';
let { base: { WIDTH } } = reduxStore.getState();
reduxStore.subscribe(() => {
    const { base, lastAction: { type } } = reduxStore.getState();

    if (type !== UPDATE_BASE) return;

    ({ WIDTH } = base);
})

// Components
import Icon from 'components/Utils/Icon';
import Spin from 'components/Utils/Spin';
import Transition from 'components/Utils/Transition';
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
        const imgWidth = this.refs.largeImg.offsetWidth;
        const BOUND = {
            preCursorBound: imgWidth * 2 / 5,
            nextCursorBound: imgWidth * 3 / 5
        };
        const X = e.clientX - (WIDTH.windowWidth - imgWidth) / 2;

        if (X < BOUND.preCursorBound){
            this.imgClassList
            .remove('cursor--next', 'cursor--zoomOut')
            .add('cursor--pre')
        } else if (X > BOUND.nextCursorBound) {
            this.imgClassList
            .remove('cursor--pre', 'cursor--zoomOut')
            .add('cursor--next')
        } else {
            this.imgClassList
            .remove('cursor--pre', 'cursor--next')
            .add('cursor--zoomOut')
        }
    }
    handleClick(e) {
        if (/a|svg|use/i.test(e.target.tagName)) return;

        const { index, count, onZoomIn } = this.props;
        const elem = this.refs.largeImg;
        const nextIndex = elem.className.search('cursor--pre') >= 0 
                            ? index - 1
                        : elem.className.search('cursor--next') >= 0 
                            ? index + 1
                        : index;

        if (nextIndex < 0 || nextIndex >= count) return;

        onZoomIn(nextIndex)
    }
    handleImageLoaded(e) {
        fuckLongWeibo(e)
        this.setState({ loading: false })
    }
    componentDidMount() {
        const elem = this.refs.largeImg;

        this.imgClassList = new ClassList(elem);

        if (this.props.count > 1) {
            elem.addEventListener('mousemove', this.handleCursorChange)
        } else {
            this.imgClassList.add('cursor--zoomOut')
        }
    }
    componentWillUnmount() {
        const elem = this.refs.largeImg;

        this.props.count > 1 && elem.removeEventListener('mousemove', this.handleCursorChange)
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
            <div className="post-media" onClick={this.handleClick} ref="largeImg" role="button">
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
                        onClick={this.zoomIn.bind(this, index, item.image_url)}
                    />;
                })}
                </div>
            )}

            {largeImgSrc && (
                <LargeImg
                    src={largeImgSrc}
                    index={largeImgIndex}
                    count={media.length}
                    onZoomIn={this.zoomIn}
                /> 
            )}
            </div>
        );
    }
}