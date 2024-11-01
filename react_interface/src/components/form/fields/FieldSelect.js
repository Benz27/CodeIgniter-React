import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Dropdown } from 'primereact/dropdown';
import { arrayToSelValue, toSelValue } from '../functions/json/toSelValue';
import { findFromOptions } from '../functions/array/findFromOptions';
import _ from 'lodash';



export const FieldSelect = forwardRef(function FieldSelect(props, ref) {

    // const { options, dataSet } = props;




    const [selectedOption, setSelectedOption] = useState(null);
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
        keyToFetch: props?.keyToFetch ?? "name",
        finalToKey: props.hasOwnProperty("finalToKey") ? (props?.finalToKey === undefined) ? true : props?.finalToKey : false,
        // final: props.hasOwnProperty("finalToKey"),
    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);


    const [initial, setInitial] = useState({
        value: null,
        options: null
    });
    const [options, setOptions] = useState([]);
    const [propOptions] = useState(props?.options);
    const [filterSubmitValue] = useState(props?.filterSubmitValue);

    useEffect(() => {
        const key = config?.keyToFetch;
        const fn = (config?.finalToKey === true) ? (value) => {
            if (typeof value === "object") {
                return value[key];
            }
            return value;
        } : false;

        fieldProps.registerFieldMod(fn);
        // console.log("initial");

    }, [config?.keyToFetch, config?.finalToKey, filterSubmitValue]);


    useEffect(() => {
        // console.log("exx");

        if (props?.options) {
            let nOptions = [];

            if (typeof props?.options === 'function') {
                const fetchData = async () => {
                    try {
                        nOptions = await props?.options();

                        // setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
                        setOptions(nOptions);
                    } catch (error) {
                        // console.error('Error running props.options:', error);

                    }
                };

                fetchData();

                return;
            }

            nOptions = props?.options ?? [];


            // setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
            setOptions(nOptions);
        }
        // return arrayToSelValue(nOptions, selCode || "code", selName || "name");
    }, [propOptions]);





    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);


    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });

        return () => {
            fieldProps.unMount();
        };

    }, [config]);

    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);


    }, [dynamicConfig, DCKey]);



    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues, null, { callOnChange: false });
        // console.log(getValues(fieldProps.getField()));
        // console.log("initial");

    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);

    useEffect(() => {
        // console.log("exx");
        const value = getValues(fieldProps.getField());
        if ((typeof value === "string" || typeof value === "number") && (value !== undefined && value !== null)) {
            setInitial((prev) => {
                return { value, options: prev.options }
            });
        }

        if (Array.isArray(options)) {
            if (options.length > 0) {
                const prev_options = initial?.options;
                if (!_.isEqual(prev_options, initial?.options) || (!Array.isArray(initial?.options) || !Array.isArray(prev_options))) {
                    setInitial((prev) => {
                        return { value: prev.value, options: options }
                    });
                }
                // setInitial((prev) => {
                //     return { value: prev.value, options: options }
                // });
            }
        }
        // setInitial();
    }, [watch(fieldProps.getField()), options, config?.keyToFetch]);



    useEffect(() => {

        if ((typeof initial?.value === "string" || typeof initial?.value === "number") &&
            (initial?.value !== undefined && initial?.value !== null) &&
            (Array.isArray(initial?.options))) {
            // console.log("changed");

            const _value = findFromOptions({ options: initial?.options, key: config?.keyToFetch, value: initial?.value });
            setInitial((prev) => {
                return { value: _value, options: prev.options }
            });
            fieldProps.setAndCall(_value, setSelectedOption);
            // setSelectedOption(_value);
        }
    }, [initial]);






    useImperativeHandle(ref, () => {
        return {
            async options(value) {
                // console.log("OPRIONS set from ref");
                if (Array.isArray(value)) {
                    setOptions(value);
                }
                // setOptions(arrayToSelValue(value || [], rSelCode || selCode || "code", rselName || selName || "name", rSelCode || selCode, rselName || selName));
            },
            value() {
                // console.log(value);

                return selectedOption;
            },
        };
    }, []);

    // useEffect(() => {
    //     console.log("selectedOption",selectedOption);
    // } ,[selectedOption])




    const handleOnChange = (e) => {

        // var value = '';

        // if (e.target.value !== undefined) {
        //     value = e.target.value.code;
        // }




        if (!config?.readOnly) {
            const value = e?.target?.value;
            fieldProps.setAndCall(value, setSelectedOption);
        }


    }

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

                <Dropdown
                    id={fieldProps.getField()}
                    value={selectedOption}
                    readOnly={config?.readOnly ?? false}
                    disabled={config?.disabled ?? false}
                    className={fieldProps.toggleErrClass(errors)}
                    onChange={handleOnChange}
                    options={options}
                    optionLabel={config?.optionLabel ?? "name"}
                    placeholder={fieldProps.getPlaceHolder()}
                    filter={config?.filter ?? false}
                    showClear={config?.showClear ?? false}
                />

                {/*  */}

                <HelperField helper={fieldProps.getHelper()} />


                <ErrorField field={fieldProps.getField()} />

            </div>

    )
});


