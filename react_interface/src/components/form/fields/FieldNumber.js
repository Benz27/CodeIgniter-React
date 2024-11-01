import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { InputNumber } from 'primereact/inputnumber';


export const FieldNumber = forwardRef(function FieldNumber(props, ref) {
    const formContextValues = useFormContext();
    const { errors, getValues, fieldDynamicConfig, DCKey, fieldValues } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);

    const [defaultConfig, setDefaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        mode: props?.mode ?? "decimal",
        rules: {
            required: props?.rules?.required ?? props?.required ?? false,
            min: props?.min ?? null,
            max: props?.max ?? null,

        },

    });
    const [min, setMin] = useState(props?.min ?? null);
    const [max, setMax] = useState(props?.max ?? null);

    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);


    const [numVal, setNumVal] = useState(0);

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
        return () => {
            fieldProps.unMount();
        };

    }, [config]);

    useEffect(() => {
        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);
    }, [dynamicConfig, DCKey]);

    const handleFieldValue = async (fieldValues, min, max) => {
        await fieldProps.setFFVal(fieldValues, (value) => {
            if (!isNaN(min)) {
                if (value < min) {
                    return min;

                }
            }

            if (!isNaN(max) && max !== null) {
                if (value > max) {
                    return max;
                }
            }
            return value;

        })
        setNumVal(getValues(fieldProps.getField()));

    }
    useEffect(() => {
        handleFieldValue(fieldValues, min, max);
    }, [fieldValues, min, max]);

    const handleOnChange = (e) => {

        let final_value = e.value;
        if (!isNaN(min)) {
            if (final_value < min) {
                final_value = min;
            }
        }

        if (!isNaN(max) && max !== null) {
            if (final_value > max) {
                final_value = max;
            }
        }

        // setNumVal(final_value);
        fieldProps.setAndCall(final_value, setNumVal);

    };

    useImperativeHandle(ref, () => {
        return {
            setValue(value) {
                let final_value = value;
                if (!isNaN(min)) {
                    if (final_value < min) {
                        final_value = min;
                    }
                }

                if (!isNaN(max) && max !== null) {
                    if (final_value > max) {
                        final_value = max;
                    }
                }
              
                fieldProps.setAndCall(final_value, setNumVal);

            },
        };
    }, [min, max]);


    return (
        <div className="flex flex-column align-items-start">

<div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}

            <InputNumber inputId={fieldProps.getField()}

                value={numVal}
                placeholder={fieldProps.getPlaceHolder()}
                onValueChange={handleOnChange}
                onChange={handleOnChange}
                className={fieldProps.toggleErrClass(errors)}
                mode={config?.mode ?? "decimal"}
                showButtons
                readOnly={config?.readOnly ?? false}
                disabled={config?.disabled ?? false}
                min={config?.rules?.min ?? 0} max={config?.rules?.max ?? null}

            />

            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )

});
