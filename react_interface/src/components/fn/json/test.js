const getPathValue = (obj, path) =>{
    const _path = (typeof path === "string") ? path.split(".") : path;
    let _obj = {...obj};
    for(const p of _path){
        _obj = _obj?.[p.trim()] ?? undefined;
    }
    return _obj;
}

const findFromArray = ({ arr, element, path, config }) => {

    const _arr = [...arr];
    let _index = 0;
    let found = false;
    for (const ar of _arr) {
        if (typeof ar === "string") {
            if (ar === element) {
                found = true;
                break;
            }
            _index++;
            continue;
        }
        const deep_ar = getPathValue(ar, path);
        if (deep_ar === element) {
            found = true;
            break;
        }
        _index++;
    }

    const _final_index = (found === true) ? _index : (config?.toLengthInstead) ? _arr.length : -1;
    return { index: _final_index, length: _arr.length }
}


const extractDependencies = ({ signatures }) => {

    const extracted_signatures = [];
    for (const r_s of signatures) {
        if (Array.isArray(r_s.dependencies) === false) {
            continue;
        }

        let index = 0;
        const _final_dependencies = [];
        for (const dep of r_s.dependencies) {
           
          
            const _dep = {};
            const s_index = findFromArray({ arr: signatures, element: dep, path: "id" }).index;
            _dep["role"] = signatures[s_index]["role"];
            if (signatures[dep]?.["department"]) {
                _dep["dep_id"] = signatures[s_index]["department"];
            }

            _final_dependencies.push(_dep);
            index++;
        }
        r_s["dependencies"] = _final_dependencies;
        extracted_signatures.push(r_s);

    }



    return extracted_signatures;
}


const sample_temporary_signatures = [
    {
        id: "A",
        role: "Head",
        dependencies: [],
        expected_dependencies: {
        }
    },
    {
        id: "B",
        dep_id: 123456,
        role: "Property Controller",
        dependencies: ["A"],
        expected_dependencies: {
            0: [{ role: "Head" }]
        }
    },
    {
        id: "C",
        dep_id: 123456,
        role: "Director",
        dependencies: ["B"],
        expected_dependencies: {
            0: [{ dep_id: 123456, role: "Property Controller" }]
        }
    }
]

console.log(JSON.stringify(extractDependencies({signatures:sample_temporary_signatures})));

