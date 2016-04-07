import ClassList from 'classlist';

export const addClassTemporarily = (elem, className, timeout) => {
    const targetClassList = new ClassList(elem);

    targetClassList.add(className);
    setTimeout(() => {
        targetClassList.remove(className);
    }, timeout);
};
