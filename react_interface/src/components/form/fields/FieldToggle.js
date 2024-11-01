import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { ToggleButton } from "primereact/togglebutton";
import { Checkbox } from 'primereact/checkbox';

export const FieldToggle = forwardRef(function FieldToggle(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);

    const [checked, setChecked] = useState(false);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props.hasOwnProperty("readOnly") ? (props?.readOnly === undefined) ? true : props?.readOnly : false,
        disabled: props.hasOwnProperty("disabled") ? (props?.disabled === undefined) ? true : props?.disabled : false,
        rules: { required: props?.rules?.required ?? props.hasOwnProperty("required") ? (props?.required === undefined) ? true : props?.required : false, },
        onLabel: props?.onLabel ?? "True",
        offLabel: props?.offLabel ?? "False",
        onIcon: props?.onIcon ?? "",
        offIcon: props?.offIcon ?? "",
        checkbox: props.hasOwnProperty("checkbox") ? (props?.checkbox === undefined) ? true : props?.checkbox : false
    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);

    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);

    useEffect(() => {
        fieldProps.registerFieldMod();
    }, []);

    useEffect(() => {
        fieldProps.registerComponents({
            config: config
        });
        // console.log("con")

        return () => {
            fieldProps.unMount();
            // console.log("m/unm", fieldProps.getField())
        };

    }, []);
    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);


    }, [dynamicConfig, DCKey]);



    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues, (value) => {
            return (typeof value === "boolean") ? value : false
        });
        setChecked(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);

    // 
    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            fieldProps.setAndCall(e.target?.checked ?? e.target.value, setChecked);
        };
    };


    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}
            {(config?.checkbox === true) ?
                <>
                    <Checkbox id={fieldProps.getField()}
                        checked={checked}
                        onChange={handleOnChange}
                        disabled={config?.disabled ?? false}
                        className={fieldProps.toggleErrClass(errors)}
                    >
                    </Checkbox>
                </> :
                <>
                    <ToggleButton
                        id={fieldProps.getField()}
                        checked={checked}
                        onChange={handleOnChange}
                        className={fieldProps.toggleErrClass(errors)}
                        disabled={config?.disabled ?? false}
                        onLabel={config?.onLabel}
                        offLabel={config?.offLabel}
                        onIcon={config?.onIcon}
                        offIcon={config?.offIcon}
                    />
                </>}


            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});

// const cbox = props.hasOwnProperty("checkBox") ? (props?.checkBox === undefined) ? true : props?.checkBox : false
