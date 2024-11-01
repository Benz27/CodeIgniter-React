import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Chips } from "primereact/chips";




export const FieldChips = forwardRef(function FieldChips(props, ref) {





    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();



    const fieldRef = useRef(null);

    const fieldProps = new FieldProperties(props, formContextValues, fieldRef);
    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },

    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);
    const [value, setValue] = useState([]);
    const input = useRef(null);

    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);


    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });
        // console.log("con")

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
            return (Array.isArray(value)) ? value : [];
        });
        setValue(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            fieldProps.setAndCall(e.value, setValue);
        }
    }


    useImperativeHandle(fieldRef, () => {
        return {
            async options(value) {
                await value;
                console.log(value);
            },
            value(justCode) {
                if (justCode) {
                    // return selectedOption;
                }
            }
        };
    }, []);


    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}

            {/* <InputText id={fieldProps.getField()}
                ref={input}

                className={fieldProps.toggleErrClass(errors)}
                placeholder={fieldProps.getPlaceHolder()}
                readOnly={config?.readOnly ?? false}
                disabled={config?.disabled ?? false}
                onChange={fieldProps.setValOnChange} /> */}

            <Chips value={value} onChange={handleOnChange}
                className={`p-fluid ${fieldProps.toggleErrClass(errors)}`}
                placeholder={fieldProps.getPlaceHolder()}
                disabled={config?.disabled ?? false}
                eadOnly={config?.readOnly ?? false}
            />

            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});
