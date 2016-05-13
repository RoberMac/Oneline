import React from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import Jump from 'utils/jump';
import { TIMELINE_SCROLL } from 'utils/constants';

// Components
import Icon from '../Icon';

export default class ScrollToTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isShowScrollBtn: false };
        this.scrollToTop = this.scrollToTop.bind(this);
        this.setScrollBtnState = this.setScrollBtnState.bind(this);
        this.handleContainerScoll = this.handleContainerScoll.bind(this);
    }
    componentDidMount() {
        this.debounceHandleContainerScoll = debounce(this.handleContainerScoll, 300);

        const containerElem = document.querySelector(TIMELINE_SCROLL.container);
        containerElem.addEventListener('scroll', this.debounceHandleContainerScoll);
    }
    componentWillUnmount() {
        const containerElem = document.querySelector(TIMELINE_SCROLL.container);
        containerElem.removeEventListener('scroll', this.debounceHandleContainerScoll);
    }
    setScrollBtnState(isShow) {
        this.setState({ isShowScrollBtn: isShow });
    }
    scrollToTop() {
        new Jump().jump(TIMELINE_SCROLL.target, {
            container: TIMELINE_SCROLL.container,
            duration: TIMELINE_SCROLL.duration,
        });
    }
    handleContainerScoll(e) {
        const BOUND = 70;
        const { isShowScrollBtn } = this.state;

        const curTop = e.target.scrollTop;

        if (curTop < BOUND) {
            this.setScrollBtnState(false);
        } else if (!isShowScrollBtn && curTop < this.lastPosTop) {
            this.setScrollBtnState(true);
            setTimeout(() => this.setScrollBtnState(false), 7000);
        }
        this.lastPosTop = curTop;
    }
    render() {
        const { isShowScrollBtn } = this.state;
        const scrollBtnClass = classNames({
            'scrollTo scrollTo--top tips animate--faster': true,
            'scrollTo--top--active': isShowScrollBtn,
        });

        return (
            <button className={scrollBtnClass} onClick={this.scrollToTop}>
                <Icon name="triangle" />
            </button>
        );
    }
}
