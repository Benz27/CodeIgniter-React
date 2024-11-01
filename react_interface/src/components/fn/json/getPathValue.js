
export const getPathValue = (obj, path) =>{
    const _path = (typeof path === "string") ? path.split(".") : path;
    let _obj = {...obj};
    for(const p of _path){
        _obj = _obj?.[p.trim()] ?? undefined;
    }
    return _obj;
}


// export const getPathValue = (obj, pathString) => {

//     if(!pathString || !obj || (typeof obj !== 'object' && Array.isArray(obj))){
//         return obj;
//     }

//     const path = pathString.split('.');
//     let _obj = {...obj};
//     for(const p of path){
//         _obj = _obj?.[p.trim()] ?? undefined;
//     }
//     // path.forEach(key => {

//     //     obj = obj?.[key.trim()] ?? undefined;
//     // });

//     return _obj;
// }
