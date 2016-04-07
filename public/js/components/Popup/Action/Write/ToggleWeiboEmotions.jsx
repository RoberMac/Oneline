import React from 'react';
import classNames from 'classnames';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class ToggleWeiboEmotions extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: false };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        const { selected } = this.state;
        const { onChange } = this.props;

        this.setState({ selected: !selected });
        onChange({ emotions: !selected });
    }
    render() {
        const { selected } = this.state;
        const btnClass = classNames({
            'write__btn write__btn--left tips--deep--peace': true,
            'tips--active--peace': selected,
        });

        return (
            <button className={btnClass} type="button" onClick={this.handleClick}>
                <Icon name="emotions" />
            </button>
        );
    }
}
