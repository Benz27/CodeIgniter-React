import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { AutoComplete } from "primereact/autocomplete";
import { arrayToSelValue, toSelValue } from "../functions/json/toSelValue";
export const FieldAutoComplete = forwardRef(function FieldAutoComplete(props, ref) {


    const [selectedOption, setSelectedOption] = useState(null);
    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();


    const fieldProps = new FieldProperties(props, formContextValues);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const [config, setConfig] = useState(defaultConfig);



    const selCode = (props.hasOwnProperty("selCode")) ? props.selCode : null;
    const selName = (props.hasOwnProperty("selName")) ? props.selName : null;

    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(null);
    useEffect(() => {
        fieldProps.registerFieldMod();
    }, []);


    useEffect(() => {
        if (props?.options) {
            let nOptions = [];

            if (typeof props?.options === 'function') {
                const fetchData = async () => {
                    try {
                        nOptions = await props?.options();

                        setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
                    } catch (error) {
                        // console.error('Error running props.options:', error);

                    }
                };

                fetchData();

                return;
            }

            nOptions = props?.options ?? [];


            setOptions(arrayToSelValue(nOptions, selCode || "code", selName || "name", selCode, selName));
        }
    }, [props?.options]);

    const searchOptions = (event) => {
        if (options === null) {
            return;
        }
        let query = event.query;

        let _filteredOptions = [];

        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            if (option.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                _filteredOptions.push(option);
            }
        }

        setFilteredOptions(_filteredOptions);
    }



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
        await fieldProps.setFFVal(fieldValues, (value) => {
            if (!value) {
                return null;
            }
            if (typeof value === "string") {
                return value;
            }
            const _value = toSelValue(value, selCode || "code", selName || "name", selCode || undefined, selName || undefined);
            return (!_value?.name || !_value?.code) ? null : _value;
        });

        setSelectedOption(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    useImperativeHandle(ref, () => {
        return {
            async options(value, rSelCode, rselName) {
                setOptions(arrayToSelValue(value || [], rSelCode || selCode || "code", rselName || selName || "name", rSelCode || selCode, rselName || selName));
            },
            value() {
                // console.log(value);

                return selectedOption;
            },
        };
    }, []);




    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            const value = e?.target?.value;
            fieldProps.setAndCall(value, setSelectedOption);
        }
    }

    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            <AutoComplete
                value={selectedOption}
                className={fieldProps.toggleErrClass(errors)}
                placeholder={fieldProps.getPlaceHolder()}
                suggestions={filteredOptions}
                completeMethod={searchOptions}
                virtualScrollerOptions={{ itemSize: 38 }}
                readOnly={config?.readOnly ?? false}
                disabled={config?.disabled ?? false}
                field="name"
                dropdown
                onChange={handleOnChange} />

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />
        </div>

    )
})

