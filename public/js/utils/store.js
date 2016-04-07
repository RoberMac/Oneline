const parseJSON = data => {
    let returnData;
    try {
        returnData = JSON.parse(data);
    } catch (e) {
        // empty
    } finally {
        return returnData;
    }
};

export default {
    get: key => {
        __DEV__ && console.log(`[store:GET] ${key}`);
        return parseJSON(localStorage.getItem(key));
    },
    set: (key, value) => {
        __DEV__ && console.log(`[store:SET] ${key}`);
        return localStorage.setItem(key, JSON.stringify(value));
    },
    remove: key => localStorage.removeItem(key),
};
