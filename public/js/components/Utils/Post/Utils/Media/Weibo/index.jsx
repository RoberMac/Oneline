import React from 'react';
import classNames from 'classnames';

// Components
import LargeImg from './LargeImg';

// Export
export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = { largeImgSrc: '', largeImgIndex: -1 };
        this.handleZoom = this.handleZoom.bind(this);
    }
    handleZoom(index, src) {
        if (index === this.state.largeImgIndex) { // Zoom Out
            this.setState({ largeImgSrc: '', largeImgIndex: -1 });
        } else { // Zoom In
            this.setState({
                largeImgSrc: src || this.props.media[index].image_url,
                largeImgIndex: index,
            });
        }
    }
    render() {
        const { media } = this.props;
        const { largeImgSrc, largeImgIndex } = this.state;
        const thumbWrapperClass = classNames({
            'post-media--small': largeImgIndex >= 0,
            'post-media post-media--thumb overflow--x cursor--zoomIn': true,
        });

        return (
            <div>
            {(media.length !== 1 || largeImgIndex < 0) && (
                <div className={thumbWrapperClass}>
                {media.map((item, index) => {
                    const thumbClass = classNames({
                        'post-media--gif': item.type === 'gif',
                        'post-media--active cursor--zoomOut': index === largeImgIndex,
                        'post-media--inactive': largeImgIndex >= 0 && index !== largeImgIndex,
                        'animate--faster': true,
                    });
                    return (
                        <img
                            key={index}
                            className={thumbClass}
                            src={item.image_url}
                            onClick={() => this.handleZoom(index, item.image_url)}
                        />
                    );
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
