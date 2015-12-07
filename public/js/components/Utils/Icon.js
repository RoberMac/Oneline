import React from 'react';

export const Icon = props => (
    <svg viewBox={props.viewBox}>
        <use xlinkHref={`/public/img/icon-sprites.svg#${props.name}`}></use>
    </svg>
);
Icon.propTypes = {
    viewBox: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
}