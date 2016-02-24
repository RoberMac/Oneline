import React from 'react';
import classNames from 'classnames';

// Helpers
import { selectSearchType } from 'utils/select';

// Components
import Icon from 'components/Utils/Icon';

// Export
export default class SearchBar extends React.Component {
    constructor(props) {
        super(props)

        const initTypeList = selectSearchType[props.type][props.provider];
        this.state = {
            active: props.type === 'local' ? false : true,
            typeList: initTypeList,
            currentType: initTypeList[0]
        }
        this.toggleType = this.toggleType.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRightBtnClick = this.handleRightBtnClick.bind(this)
    }
    toggleType() {
        const { typeList, currentType } = this.state;
        const inputElem = this.refs.input;
        const index = typeList.findIndex((item, i) => item.name === currentType.name);
        const nextType = typeList[typeList.length - 1 > index ? index + 1 : 0];

        inputElem.focus()
        this.setState({ currentType: nextType }, () => this.handleSubmit())
    }
    handleSubmit(e) {
        e && e.preventDefault()

        const { currentType: { name: searchType } } = this.state;
        const searchText = this.refs.input.value.trim().toLowerCase();

        this.props.onSearchChange({ searchType, searchText })
    }
    handleRightBtnClick(){
        const { type } = this.props;
        const { active } = this.state;
        const inputElem = this.refs.input;

        switch (type){
            case 'local':
                if (active) {
                    inputElem.blur()
                    inputElem.value = ''
                } else {
                    inputElem.focus()
                }
                this.setState({ active: !active })
                break;
            case 'remote':
                inputElem.value = ''
                inputElem.focus()
                break;
        }

        this.props.onRightBtnClick()
    }
    componentDidUpdate() {
        if (this.props.searchText){
            this.refs.input.value = this.props.searchText
        }
    }
    render() {
        const { type } = this.props;
        const { active, currentType } = this.state;
        const searchBarClass = classNames({
            'searchBar animate--faster': true,
            [`searchBar--${type}`]: true,
            'searchBar--active': active
        });
        const leftBtnClass = classNames({
            'searchBar__btn searchBar__btn--left': true,
            'color--gray-drak': active,
            'color--white': !active
        });
        const rightBtnClass = classNames({
            'searchBar__btn searchBar__btn--right': true,
            'color--gray-drak': active,
            'color--white': !active
        });
        return (
            <div className={searchBarClass}>
                <form className="searchBar__form" onSubmit={this.handleSubmit}>
                    {active && (
                        <button className={leftBtnClass} type="button" onClick={this.toggleType}>
                            <Icon name={currentType.icon} />
                        </button>
                    )}
                    <input
                        className="searchBar__input animate--faster"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        ref="input"
                    />
                    <button className={rightBtnClass} type="button" onClick={this.handleRightBtnClick}>
                        <Icon name={active ? 'cancel' : 'search'} />
                    </button>
                </form>
            </div>
        );
    }
}