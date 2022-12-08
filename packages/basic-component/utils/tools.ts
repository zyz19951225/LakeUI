const scopedClassMaker = (prefix: string) => {
    return function (classNameSting: string) {
        let newClassNameString = ''
        classNameSting.split(' ').forEach(
            item=> {
                newClassNameString +=[prefix, item].filter(Boolean).join('-')+" "
            }
        )
        return newClassNameString.trim()
    };
};

const sc = scopedClassMaker('lab');


export default sc
