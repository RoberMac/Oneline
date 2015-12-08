const parseJSON = data => {
    try {
        data = JSON.parse(data)
    } catch (e) {
    } finally {
        return data
    }
}

export default {
    get: key => parseJSON(localStorage.getItem(key)),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: key => localStorage.removeItem(key)
}