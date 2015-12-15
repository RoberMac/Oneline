export default (value, unit, suffix) => {
    let formattedSuffix = suffix === 'ago' ? '' : ' from now';
    let formattedUnit;

    switch (unit){
        case 'second':
            formattedUnit = 's';
            break;
        case 'minute':
            formattedUnit = 'm';
            break;
        case 'hour':
            formattedUnit = 'h';
            break;
        case 'day':
            formattedUnit = 'd';
            break;
        case 'week':
            formattedUnit = 'w';
            break;
        case 'month':
            formattedUnit = 'M';
            break;
        case 'year':
            formattedUnit = 'Y';
            break;
    }

    return `${value}${formattedUnit}${formattedSuffix}`
}