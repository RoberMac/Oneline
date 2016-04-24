'use strict';
module.exports = data => {
    let returnData;
    try {
        returnData = JSON.parse(data);
    } catch (e) {
        returnData = data;
    } finally {
        return returnData;
    }
};
