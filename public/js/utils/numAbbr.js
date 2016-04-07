export default num => {
    const _num = parseInt(num, 10);

    if (_num >= 1000000) {
        return `${Math.round(_num / 1000000)}m`;
    } else if (_num >= 10000) {
        return `${Math.round(_num / 1000)}k`;
    }

    return `${_num}`;
};
