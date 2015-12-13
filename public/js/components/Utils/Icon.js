import React from 'react';

export default ({ viewBox, name, className }) => (
    <svg viewBox={viewBox} className={className ? className : ''}>
        <use xlinkHref={`/public/img/icon-sprites.svg#${name}`}></use>
    </svg>
);