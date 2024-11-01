import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
class StateStructure {

    constructor(props) {
        this.key = props?.key ?? undefined;
        this.value = props?.value ?? {};
        this.singleUse = props?.singleUse ?? false;
    }

    get() {
        return this?.value ?? undefined;
    }

}




const GlobalStateContext = createContext();

export function useGlobalStateContext() {
    return useContext(GlobalStateContext);
}



export function GlobalStateContextProvider({ children }) {
    const [registry, setRegistry] = useState({});

    const set = ({ key, value, singleUse }, Callback) => {

        setRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[key] = new StateStructure({ key, value, singleUse });
            return hold;
        });

        if (typeof Callback === 'function' && Callback !== undefined) {
            Callback();
        }
    }

    const patch = ({ key, value }, Callback) => {

        const reg = { ...registry[key] }
        const reg_val = reg.get();

        if (typeof value === "object") {
            for (const [key, val] of Object.entries(value)) {
                // console.log(`${key}: ${value}`);
                reg_val[key] = val;
            }
        }

        setRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[key] = new StateStructure({ key, reg_val, singleUse });
            return hold;
        });

        if (typeof Callback === 'function' && Callback !== undefined) {
            Callback();
        }
    }




    const unset = (key) => {

        setRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            delete hold?.[key];
            return hold;
        });
    };

    const dispose = (key) => {
        if (registry.hasOwnProperty(key) === true && registry?.[key]?.singleUse === true) {
            unset(key);
        }
    };

    const singleUse = (key) => {
        if (registry.hasOwnProperty(key) === true && registry?.[key]?.singleUse === true) {
            unset(key);

        }
    };


    const instance = (key) => {

        const reg = registry?.[key] ?? undefined;
        return reg;
    }


    const exists = (key) => {
        return registry.hasOwnProperty(key);
    }

    const val = (key) => {
        return registry?.[key]?.get(key) ?? undefined;
    }


    const init = (key) => {
        const inst = instance(key);
        const data = inst?.get() ?? undefined;

        return { inst, data, singleUse }
    }

    // useEffect(() => {

    //     console.log("registry: ", registry);

    // }, [registry])

    const value = {
        patch,
        registry, setRegistry,
        set,
        instance,
        exists,
        val,
        unset,
        dispose,
        singleUse,
        init
    };


    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>

    )
}
