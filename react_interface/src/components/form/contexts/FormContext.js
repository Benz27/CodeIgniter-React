import React, { createContext, useContext, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { bubbleSortWithLogs, sortPartners } from '../../fn/array/sorting';

import _ from 'lodash';
import { genId } from '../../fn/utils/genID';
const FormContext = createContext();

export function useFormContext() {
    return useContext(FormContext);
}

export const FormContextProvider = forwardRef(function FormContextProvider({ onDone: onDoneProp, beforeSubmit: beforeSubmitProp, children }, ref) {

    const [errorMessages, setErrorMessages] = useState({});
    const [rules, setRules] = useState({});
    const [fieldRegistry, setFieldRegistry] = useState({});
    const [fieldConfig, setFieldConfig] = useState({});

    // all around settings
    const [fieldValues, setFieldValues] = useState({});
    const [fieldDynamicConfig, setFieldDynamicConfig] = useState({});
    const [DCKey, setDCKey] = useState(null);

    // data only
    const [state, setState] = useState(null);
    const toast = useRef(null);
    const refsRegistry = useRef({});

    const defaultValues = {};
    const [fieldModRegistry, setFieldModRegistry] = useState({});

    const [dataModPriorityRegistry, setDataModPriorityRegistry] = useState([]);
    const [dataModRegistry, setDataModRegistry] = useState({});

    const [errorPriorityRegistry, setErrorPriorityRegistry] = useState([]);
    const [errorRegistry, setErrorRegistry] = useState({});

    const submissionsRef = useRef({});

    const onDonePropCallback = (typeof onDoneProp === "function") ? onDoneProp : () => { };
    const beforeSubmitPropCallback = (typeof beforeSubmitProp === "function") ? beforeSubmitProp : () => { };

    const onDoneCallbackCollection = useRef([onDonePropCallback]);
    const onBeforeSubmitCallbackCollection = useRef([beforeSubmitPropCallback]);
    const onErrorCallbackCollection = useRef([]);
    const onSuccessCallbackCollection = useRef([]);

    const on = (type, callback) => {
        if (typeof callback !== "function") {
            console.error(`At addEventListener. Expecting callback at 2nd argument. found ${typeof callback}`);
            return;
        };

        if (type === "before") {
            onBeforeSubmitCallbackCollection.current.push(callback);
            return;
        };

        if (type === "done") {
            onDoneCallbackCollection.current.push(callback);
            return;
        };

        if (type === "error") {
            onErrorCallbackCollection.current.push(callback);
            return;
        };

        if (type === "success") {
            onSuccessCallbackCollection.current.push(callback);
            return;
        };
    };

    const onDone = (callback) => {
        onSuccessCallbackCollection.current.push(callback);
    };

    useImperativeHandle(ref, () => {
        return {
            on,
        };
    }, []);

    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset,
        setError,
        clearErrors,
        control,
        watch,
        trigger
    } = useForm({
        defaultValues: {},
    });


    const registerError = ({ key, assoc = [], method, priority, DCKey, message }) => {
        const id = genId();
        setErrorRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[id] = { method: method, key: key, assoc: assoc, DCKey: DCKey || "$", message: message };
            return hold;
        });
        setErrorPriorityRegistry((prevRegistry) => {
            const hold = [...prevRegistry];
            hold.push([priority || 0, id]);
            return hold;
        });
    };

    const registerFieldModification = (key, value) => {
        setFieldModRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[key] = value;
            return hold;
        });
    };

    const registerFieldErrorMessages = (key, value) => {
        setErrorMessages((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[key] = value;
            return hold;
        });
    };
    const unRegisterFieldErrorMessages = (key) => {
        setErrorMessages((prevRegistry) => {
            const hold = { ...prevRegistry };
            delete hold[key];
            return hold;
        });
    };

    const unRegisterFieldModification = (key) => {
        setFieldModRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            delete hold[key];
            return hold;
        });
    };

    const unRegisterDataModification = (id, key) => {
        const _DCKey = key || "$";
        setDataModRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            delete hold[`${id}_${_DCKey}`];
            return hold;
        });
        setDataModPriorityRegistry((prevRegistry) => {
            const hold = [...prevRegistry];
            const index = hold.indexOf(`${id}_${_DCKey}`);
            if (index > -1) {
                hold.splice(index, 1);
            }
            return hold;
        });
    };

    const registerDataModification = (id, key, value, priority) => {
        const _DCKey = key || "$";
        setDataModRegistry((prevRegistry) => {
            const hold = { ...prevRegistry };
            hold[`${id}_${_DCKey}`] = { method: value, key: _DCKey };
            return hold;
        });
        setDataModPriorityRegistry((prevRegistry) => {
            const hold = [...prevRegistry];
            hold.push([priority || 0, `${id}_${_DCKey}`]);
            return hold;
        });
    };

    const registerSubmission = (key, value) => {
        submissionsRef.current[key || "$"] = value;
    };

    const resetAllRegistries = () => {
        setDataModRegistry({});
        setDataModPriorityRegistry([]);
    };
    const registerRef = (key, ref) => {
        refsRegistry.current[key] = ref;
    };
    const unregisterRef = (key) => {
        delete refsRegistry.current[key];
    };

    const destructureAndSortPriorityRegistry = () => {
        const keys = [];
        const priorities = [];
        const localRegistry = {};
        for (const arr of dataModPriorityRegistry) {
            if (!localRegistry?.[arr[1]]) {
                localRegistry[arr[1]] = true;
                priorities.push(arr[0]);
                keys.push(arr[1]);
            }
        }
        bubbleSortWithLogs(priorities, "descending", sortPartners([keys]), { reference: true })
        return { keys, priorities };
    };

    const destructureAndSortErrorRegistry = () => {
        const keys = [];
        const priorities = [];
        for (const arr of errorPriorityRegistry) {
            priorities.push(arr[0]);
            keys.push(arr[1]);
        };
        bubbleSortWithLogs(priorities, "descending", sortPartners([keys]), { reference: true });
        return { keys, priorities };
    };

    const runOnBeforeSubmitCallbacks = () => {
        for (const cb of onBeforeSubmitCallbackCollection.current) {
            cb();
        }
    };

    const runOnDoneCallbacks = () => {
        for (const cb of onDoneCallbackCollection.current) {
            // console.log(cb);
            cb();
        }
    };
    const runOnErrorCallbacks = () => {
        for (const cb of onErrorCallbackCollection.current) {
            cb();
        }
    };
    const runOnSuccessCallbacks = () => {
        for (const cb of onSuccessCallbackCollection.current) {
            cb();
        }
    };
    const onValid = async (data) => {

        const { keys } = destructureAndSortPriorityRegistry();
        const { keys: errorKeys } = destructureAndSortErrorRegistry();
        // const _data = applyFieldModifications(data);
        let nData = { ...data };

        for (const [key, value] of Object.entries(fieldModRegistry)) {
            const _data = { ...nData };
            nData[key] = value(_data[key]);
        };

        for (const key of keys) {
            const value = dataModRegistry[key];

            if (value.key === "$") {
                nData = await value.method({ ...nData }, key);
                continue;
            }

            if (DCKey === value?.key) {
                nData = await value.method({ ...nData }, key);
            }
        }

        const custom_errors = {};

        for (const key of errorKeys) {
            const value = errorRegistry[key];

            if (value.DCKey !== "$") {
                if (value.DCKey !== DCKey) {
                    continue;
                }
            }

            const result = await value.method({ ...nData });
            if (typeof result === "string" || typeof result === "object") {
                for (const assoc of value?.assoc) {

                    const _key = (typeof assoc === "object") ? assoc.key : assoc;
                    const message = (typeof result === "object") ? (result?.[_key] || "Invalid value.") : (result || "Invalud value.");

                    custom_errors[_key] = { type: value.key, ref: { name: _key, value: nData[_key] ?? nData }, message };
                    setError(_key, custom_errors[_key]);

                }
            }
        }

        const onDCSubmit = (typeof submissionsRef.current[DCKey] === "function") ? submissionsRef.current[DCKey] : (typeof submissionsRef.current?.["$"] === "function") ? submissionsRef.current?.["$"] : () => { console.error("submission function must be a function! found: ", typeof submissionsRef.current[DCKey]) };
        const main = {};
        main["data"] = { ...nData };
        if (Object.keys(custom_errors).length === 0) {
            await onDCSubmit(main);
            runOnDoneCallbacks();

        } else {
            onInvalid(custom_errors);
        }
    };

    const onInvalid = (data) => {
        console.log("invalid fields: ", data);
        runOnDoneCallbacks();
    };

    const submit = (e) => {
        runOnBeforeSubmitCallbacks();
        handleSubmit(onValid, onInvalid)(e);
    };

    const getErrors = () => {
        return errors;
    };

    // error handling
    const toggleErrorClass = (errors, field, className) => {
        return errors[field] ? className + ' p-invalid' : className;
    };



    const value = {
        registerFieldModification,
        resetAllRegistries,
        registerDataModification,
        registerSubmission,
        refsRegistry,
        registerRef,
        unregisterRef,
        submit,
        register,
        unregister,
        handleSubmit,
        setValue,
        getValues,
        reset,
        control,
        errors,
        rules,
        setRules,
        defaultValues,
        setError,
        on,
        errorMessages, setErrorMessages,
        fieldConfig, setFieldConfig,
        fieldRegistry, setFieldRegistry,
        getErrors,
        unRegisterFieldModification,
        toggleErrorClass,
        watch,
        clearErrors,
        DCKey,
        setDCKey,
        toast,

        state,
        setState,
        fieldValues,
        setFieldValues,
        fieldDynamicConfig,
        setFieldDynamicConfig,
        registerError,
        trigger,
        registerFieldErrorMessages,
        unRegisterFieldErrorMessages,
        unRegisterDataModification,
        onDone
    };
    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
});