/* eslint no-unsafe-finally: 0 */

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
