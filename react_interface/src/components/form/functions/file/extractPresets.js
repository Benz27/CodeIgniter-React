

export const extractPresets = ({presets}) => {
    const _accept_map = [];
    const types = [];
    const exts = [];

    for (const pr in presets) {
        if (pr !== "_extentions") {
            types.push(pr);
        }
        if (Array.isArray(presets[pr])) {
            if (pr === "_extentions") {
                for (const ext of presets[pr]) {
                    _accept_map.push(`.${ext}`);
                    exts.push(ext);
                }
                continue;
            }
            for (const ext of presets[pr]) {
                _accept_map.push(`${pr}/${ext}`);
                exts.push(ext);
            }
            continue;
        }


        _accept_map.push(`${pr}/${presets[pr]}`);
        if (presets[pr] !== "*") {
            exts.push(presets[pr]);
        }
    }
    const accept = _accept_map.join(", ") || "*";
    return { accept, accept_map: _accept_map, types, exts }

}

// const presets = {
//     video: "*",
//     image: ["png", "jpg"],
//     _extentions: ["pdf"]
// }

// console.log(extractPresets({presets}));

// console.log(_accept_map.join(", "), types, exts);
