import React from 'react';
import classNames from 'classnames';

import { addClassTemporarily } from '../../../../utils/dom';

import Icon from '../../../Utils/Icon';

export default class GeoPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { inprocess, selected } = this.state;
        const { onChange } = this.props;

        if (inprocess) return;

        if (selected) {
            this.setState({ inprocess: false, selected: false })
            onChange({ type: 'remove' })
        } else {
            this.setState({ inprocess: true })

            window.navigator.geolocation.getCurrentPosition(pos => {
                this.setState({ inprocess: false, selected: true })

                const { latitude, longitude } = pos.coords;
                onChange({
                    type: 'add',
                    lat: latitude,
                    long: longitude
                })
            }, err => {
                this.setState({ inprocess: false, selected: false })
                addClassTemporarily(this.refs.btn, 'tips--error', 500)
            }, { maximumAge: 60000, timeout: 7000 })
        }
    }
    render() {
        const { inprocess, selected } = this.state;
        console.log(inprocess, selected)
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected,
            'tips--inprocess': inprocess
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick} ref="btn">
                <Icon viewBox="0 0 200 200" name="geoPicker" />
            </button>
        );
    }
}