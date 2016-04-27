const daemonState = require(`${__base}/utils/daemon`).state;

module.exports = ({ minId, maxId }) => {
    const LatestPhoto = daemonState.get('unsplash') || {};

    return !maxId && minId !== LatestPhoto.id ? [[LatestPhoto]] : [];
};
