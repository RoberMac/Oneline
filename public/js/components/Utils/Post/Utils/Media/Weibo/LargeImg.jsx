import React from 'react';
import ClassList from 'classlist';

// Helpers
import { handleImageError, fuckLongWeibo } from '../helper.js';

// Components
import Spin from 'components/Utils/Spin';
import Transition from 'components/Utils/Transition';
import ViewOriginal from '../Utils/ViewOriginal';

// Export
export default class LargeImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.getBound = this.getBound.bind(this);
    }
    componentDidMount() {
        this.imgClassList = new ClassList(this.refs.largeImg);

        this.props.count <= 1 && this.imgClassList.add('cursor--zoomOut');
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.src === nextProps.src) return;
        this.setState({ loading: true });
    }
    getBound(e) {
        const imgWidth = this.refs.largeImg.offsetWidth;
        const BOUND = {
            preCursorBound: imgWidth * 2 / 5,
            nextCursorBound: imgWidth * 3 / 5,
        };
        const X = e.clientX - (window.innerWidth - imgWidth) / 2;

        if (X < BOUND.preCursorBound) {
            return 'left';
        } else if (X > BOUND.nextCursorBound) {
            return 'right';
        }
        return 'center';
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
                this.imgClassList.add('cursor--next');
                break;
            case 'center':
                this.imgClassList.add('cursor--zoomOut');
                break;
            default:
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
            default:
                break;
        }

        if (count === 1) nextIndex = index;
        if (nextIndex < 0 || nextIndex >= count) return;
        if (count === 1) {
            nextIndex = index;
        }

        onZoom(nextIndex);
    }
    handleImageLoaded(e) {
        fuckLongWeibo(e);
        this.setState({ loading: false });
    }
    render() {
        const { src } = this.props;
        const { loading } = this.state;
        const middleSrc = src.replace(/square|small/, 'bmiddle');
        const largeSrc = src.replace(/square|small/, 'large');

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
                        {loading && <Spin isFetching initLoad provider="weibo" />}
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
}
