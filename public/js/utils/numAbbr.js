export default num => {
    num = parseInt(num, 10)

    if (num >= 1000000) {
        return `${Math.round(num / 1000000)}m`;
    }
    else if (num >= 10000) {
        return `${Math.round(num / 1000)}k`;
    }
    else {
        return `${num}`;
    }
}