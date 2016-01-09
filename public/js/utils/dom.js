export const addClassTemporarily = (elem, className, timeout) => {
    elem.classList.add(className)
    setTimeout(() => {
        elem.classList.remove(className)
    }, timeout)
}