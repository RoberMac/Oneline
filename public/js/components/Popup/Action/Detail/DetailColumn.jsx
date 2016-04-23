import React from 'react';
import classNames from 'classnames';

// Components
import UserLink from 'components/Utils/UserLink';
const UserColumn = ({ type, provider, list = [] }) => {
    const columnClass = classNames({
        detail__userColumn: true,
        [`detail__userColumn--${type}`]: type,
    });

    return (
        <div className={columnClass}>
            <div className="overflow--x">
                {list.map((item, index) => (
                    <UserLink key={index} provider={provider} screen_name={item.screen_name}>
                        <span className="detail__userColumn__item detail__avatar">
                            <img
                                src={item.avatar}
                                alt={`${item.name || item.screen_name}'s avatar`}
                            />
                        </span>
                    </UserLink>
                ))}
            </div>
        </div>
    );
};
const ActionsColumn = ({ children }) => (
    <div className="detail__actionsColumn column">
        {children}
    </div>
);

// Export
export default props => (
    props.children ? <ActionsColumn {...props} /> : <UserColumn {...props} />
);
