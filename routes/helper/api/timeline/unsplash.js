"use strict";
const daemonState = require(`${__base}/utils/daemon`).state;

module.exports = opts => {
    const LatestPhoto = daemonState.get('unsplash') || {};

    return !opts.maxId && opts.minId !== LatestPhoto.id ? [[LatestPhoto]] : [];
};