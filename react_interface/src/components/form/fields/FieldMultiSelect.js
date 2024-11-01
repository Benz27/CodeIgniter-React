import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Dropdown } from 'primereact/dropdown';
import { arrayToSelValue, toSelValue } from '../functions/json/toSelValue';
import { MultiSelect } from 'primereact/multiselect';
import { findFromOptions } from '../functions/array/findFromOptions';
import _ from 'lodash';



export const FieldMultiSelect = forwardRef(function FieldMultiSelect(props, ref) {

    // const { options, dataSet } = props;

    const [selectedOptions, setSelectedOptions] = useState(null);
    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey, watch } = useFormContext();


    const fieldProps = new FieldProperties(props, formContextValues);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        showClear: props.hasOwnProperty("showClear") ? props.showClear : false,
        filter: props.hasOwnProperty("filter") ? props?.filter : false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },
        optionLabel: props?.optionLabel ?? "name",
        display: props?.display ?? "chip",
        keyToFetch: props?.keyToFetch ?? "name",
        finalToKey: props.hasOwnProperty("finalToKey"),
    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);
    const [initial, setInitial] = useState({
        value: null,
        options: null
    });
    const [filterSubmitValue] = useState(props?.filterSubmitValue);

    const [options, setOptions] = useState([]);
    const selectionRef = useRef(null);
    const value = useRef(null);
    useEffect(() => {
        const key = config?.keyToFetch;
        const fn = (config?.finalToKey === true) ? (values) => {
            const _values = [];

            for (const value of (values || [])) {
                if (typeof value === "object") {
                    _values.push(value[key]);
                    continue;
                }
                _values.push(value);
            }
            return _values;
        } : false;

        fieldProps.registerFieldMod(fn);
    }, [config?.keyToFetch, config?.finalToKey, filterSubmitValue]);



    useEffect(() => {
        selectionRef.current = (index) => {
            if (!config?.readOnly) {
                const final = options.slice(0, index);
                fieldProps.setAndCall(final, setSelectedOptions);
            }
        };
    }, [options, config]);

    useEffect(() => {
        value.current = () => { return selectedOptions };
    }, [selectedOptions])









    useEffect(() => {
        if (props?.options) {
            let nOptions = [];

            if (typeof props?.options === 'function') {
                const fetchData = async () => {
                    try {
                        nOptions = await props?.options();
                        setOptions(nOptions ?? []);
                        // setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
                    } catch (error) {
                        // console.error('Error running props.options:', error);
                    }
                };

                fetchData();

                return;
            }

            nOptions = props?.options ?? [];


            setOptions(nOptions);
            // setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
        }
        // return arrayToSelValue(nOptions, selCode || "code", selName || "name");
    }, [props?.options]);


    const defaultCounter = () => {
        const length = selectedOptions ? selectedOptions.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };



    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);


    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });
        // console.log("reg");
        return () => {
        // console.log("unreg");
            fieldProps.unMount();
        };

    }, [config]);

    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);


    }, [dynamicConfig, DCKey]);



    const handleFieldValue = async (fieldValues) => {
        // console.log(options, fieldValues);
        await fieldProps.setFFVal(fieldValues, null, { callOnChange: false });
        setSelectedOptions(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues, options]);

    useEffect(() => {
        const value = getValues(fieldProps.getField()) || [];
        const _value = [];
        // console.log(options, value);

        let set = false;
        for (const val of value) {
            if (val === undefined && val === null) {
                continue;
            }
            if (typeof val === "string" || typeof val === "number") {
                // const _val = findFromOptions({ options, key: config?.keyToFetch, value: val });
                // console.log("val", val);
                _value.push(val);
                set = true;
            }
        }

        if (set === true) {
            setInitial((prev) => {
                return { value: _value, options: prev.options }
            });
        }

        if (Array.isArray(options)) {
            // console.log(options);
            if (options.length > 0) {
                const prev_options = initial?.options;
                if(!_.isEqual(prev_options, initial?.options) || (!Array.isArray(initial?.options) || !Array.isArray(prev_options))){
                    setInitial((prev) => {
                        return { value: prev.value, options: options }
                    });
                }
               
            }
        }



    }, [getValues(fieldProps.getField()), options, config?.keyToFetch]);



    useEffect(() => {
        // console.log(initial);

        if (Array.isArray(initial?.value) === false || Array.isArray(initial?.options) === false) {
            return;
        }
        let set = false;
        const _value = [];
        for (const val of initial?.value) {
            if (val === undefined && val === null) {
                set = false;
                continue;
            }
            if (typeof val === "string" || typeof val === "number") {
                // console.log(val);
                set = true;
                _value.push(findFromOptions({ options: initial?.options, key: config?.keyToFetch, value: val }));
            }
        }

        if (set === true) {
            // console.log("set");
            fieldProps.setAndCall(_value, setSelectedOptions);
        }

    }, [initial]);






    useImperativeHandle(ref, () => {
        return {
            async options(value, rSelCode, rselName) {
                // console.log("OPRIONS set from ref");
                if(Array.isArray(value)){
                    setOptions(value);
                }
                // setOptions(arrayToSelValue(value || [], rSelCode || selCode || "code", rselName || selName || "name", rSelCode || selCode, rselName || selName));
            },
            selection(index) {
                selectionRef.current(index);
            },
            increment() {
                console.log(selectedOptions);
            },
            decrement() {
            },

            get value() {
                return value.current();
            }
        };
    }, []);






    // useEffect(() => {

    //     console.log(selectedOptions);
    // } ,[selectedOptions])

    const validateSetOptions = (value) => {

        // if (value.constructor === Array) {
        //     setOptions(value);
        //     // setSelectedOptions(null);
        //     // fieldProps.setFieldVal(null);
        //     return;
        // }
        // setOptions([]);
    }





    const handleOnChange = (e) => {

        // var value = '';

        // if (e.target.value !== undefined) {
        //     value = e.target.value.code;
        // }




        if (!config?.readOnly) {
            fieldProps.setAndCall(e.target.value, setSelectedOptions);
        }


    }

    // useEffect(() => {
    //     console.log(initial);

    // }, [initial]);

    // const getOptions = () => {
    //     let nOptions = [];

    //     if (typeof props?.options === 'function') {
    //         const fetchData = async () => {
    //             try {
    //                 nOptions = await props?.options();
    //                 // console.log(props?.options);
    //                 return arrayToSelValue(nOptions, selCode || "code", selName || "name");

    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //             }
    //         };

    //         fetchData();

    //         return;
    //     }
    //     nOptions = props?.options ?? [];
    //     return arrayToSelValue(nOptions, selCode || "code", selName || "name");

    // }


    return (
        <div className="flex flex-column align-items-start">

<div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}

            <MultiSelect
                id={fieldProps.getField()}
                value={selectedOptions}
                readOnly={config?.readOnly ?? false}
                disabled={config?.disabled ?? false}
                className={fieldProps.toggleErrClass(errors)}
                onChange={handleOnChange}
                options={options}
                
                virtualScrollerOptions={{ itemSize: 43 }}
                onMouseOver={(e)=>e.preventDefault()}
                optionLabel={config?.optionLabel ?? "name"}
                display={config?.display ?? "chip"}
                panelFooterTemplate={defaultCounter}
                placeholder={fieldProps.getPlaceHolder()}
                filter={config?.filter ?? false}
                showClear={config?.showClear ?? false} />

            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )
});

