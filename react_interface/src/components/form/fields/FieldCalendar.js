import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';

export const FieldCalendar = forwardRef(function FieldCalendar(props, ref) {
    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);
    const [value, setValue] = useState("");
    const [defaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        minDate: props?.minDate ?? (props.hasOwnProperty("minOfToday")) ? new Date() : null,
        maxDate: props?.maxDate ?? (props.hasOwnProperty("maxOfToday")) ? new Date() : null,
        selectionMode: props?.selectionMode ?? "single",
        hourFormat: props?.hourFormat ?? "12",
        showTime: props?.showTime ?? false,
        timeOnly: props?.timeOnly ?? false,
        rules: { required: props?.rules?.required ?? props?.required ?? false, },
        modified: 0
    });

    const [dynamicConfig, setDynamicConfig] = useState({
    });
    const prevConfig = useRef(defaultConfig);
    const [config, setConfig] = useState(defaultConfig);


    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
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
    }, []);

    useEffect(() => {
        const nConfig = dynamicConfig?.[DCKey] ?? {};
        setConfig((prev) => {
            return { ...prev, ...nConfig, modified: new Date().getTime() }
        });
    }, [dynamicConfig, DCKey]);

    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues, (value) => {
            // console.log(value, fieldProps.getValue());
            if (value instanceof Date) {
                return value;
            }
            return new Date();
        });
        setValue(getValues(fieldProps.getField()));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    const handleOnChange = (e) => {
        if (!config?.readOnly) {
            fieldProps.setAndCall(e?.value, setValue);
        }
    };


    // useEffect(() => {
    //     if (config.modified > prevConfig.current.modified) {
    //         prevConfig.current = config;
    //         return;
    //     }
    //     if (prevConfig.current.modified > config.modified) {
    //         // console.log("prev is newer");
    //         // console.log("prev", prevConfig.current);
    //         // console.log("config", config);
    //         setConfig(prevConfig.current);
    //         return;
    //     }
    //     //    console.log("config", config);
    //     //    console.log("prevConfig", prevConfig.current);
    // }, [config]);





    useImperativeHandle(ref, () => {
        return {
            setLimit({ start, end }) {

                setConfig((prev) => {
                    const _start = start || prev.minDate;
                    const _end = end || prev.maxDate;
                    const limit = {};
                    const value = fieldProps.getValue();
                    if (_start instanceof Date) {
                        limit["minDate"] = _start;

                        if (value < _start) {
                            fieldProps.setAndCall(_start, setValue);
                        }
                    }
                    if (_end instanceof Date) {
                        limit["maxDate"] = _end;
                        if (value > _end) {
                            fieldProps.setAndCall(_end, setValue);
                        }
                    }
                    return { ...prev, ...limit, modified: new Date().getTime() };
                });
            }
        };
    }, []);

    // const showTime = props?.showTime ?? false;
    // const hourFormat = props?.hourFormat ?? "12";
    // const selectionMode = props?.selectionMode ?? "single";

    // const minDate = props?.minDate ?? (props.hasOwnProperty("minOfToday")) ? new Date() : null;



    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}
            <Calendar
                value={value}
                className={fieldProps.toggleErrClass(errors)}
                placeholder={fieldProps.getPlaceHolder()}
                readOnlyInput
                selectionMode={config?.selectionMode ?? "single"}
                onChange={handleOnChange}
                showButtonBar
                showIcon
                disabled={config?.disabled ?? false}
                minDate={config?.minDate ?? null}
                maxDate={config?.maxDate ?? null}
                showTime={config?.showTime ?? false}
                hourFormat={config?.hourFormat ?? "12"}
                timeOnly={config?.timeOnly ?? false}
            />


            {/* <InputText id={fieldProps.getField()}
                ref={input}
                className={fieldProps.toggleErrClass(errors)}
                placeholder={fieldProps.getPlaceHolder()}
                readOnly={false}
                onChange={fieldProps.setValOnChange} /> */}
            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});
