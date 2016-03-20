"use strict";

module.exports = data => {
    try {
        data = JSON.parse(data)
    } catch (e) {
        data = data
    } finally {
        return data
    }
}