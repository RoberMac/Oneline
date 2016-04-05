import React from 'react';
import classNames from 'classnames';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class ToggleSensitive extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selected: false }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { selected } = this.state;
        const { onChange } = this.props;

        this.setState({ selected: !selected })
        onChange({ sensitive: !selected })
    }
    render() {
        const { action } = this.props;
        const { selected } = this.state;
        const btnStyle = action === 'retweet' ? { 'pointerEvents': 'none', 'opacity': '.1' } : null;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected
        });

        return (
            <button className={btnClass} style={btnStyle} type="button" onClick={this.handleClick}>
                <Icon name="sensitive" />
            </button>
        );
    }
}