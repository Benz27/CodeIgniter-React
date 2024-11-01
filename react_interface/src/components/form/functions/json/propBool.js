export const propBool = (props, path) => {
    return props.hasOwnProperty(path) ? (props?.[path] === undefined) ? true : props?.[path] : false;
}