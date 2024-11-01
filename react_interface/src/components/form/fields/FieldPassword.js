import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { FieldProperties, LabelField, ErrorField, HelperField } from './FieldProperties';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressBar } from 'primereact/progressbar';
import { propBool } from '../functions/json/propBool';


const testPassword = (password) => {
    // Regular expressions for each criteria
    const minLengthRegex = /^.{8,}$/;
    const lowercaseRegex = /.*[a-z]/;
    const uppercaseRegex = /.*[A-Z]/;
    const digitRegex = /.*\d/;
    const specialCharRegex = /.*[!@#$%^&*()_+]/;

    const combinedCriteriasRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    // Test each criteria
    const isMinLength = minLengthRegex.test(password);
    const hasLowercase = lowercaseRegex.test((password === null) ? "" : password);
    const hasUppercase = uppercaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
    const combinedCriterias = combinedCriteriasRegex.test(password);

    // Output the results
    // console.log('Minimum length (8 characters):', isMinLength);
    // console.log('Contains at least one lowercase letter:', hasLowercase);
    // console.log('Contains at least one uppercase letter:', hasUppercase);
    // console.log('Contains at least one digit:', hasDigit);
    // console.log('Contains at least one special character:', hasSpecialChar);
    // console.log('Combined criteria passed:', combinedCriterias);
    let score = 0;
    if (isMinLength) {
        score += 20;
    }
    if (hasLowercase) {
        score += 20;
    }
    if (hasUppercase) {
        score += 20;
    }
    if (hasDigit) {
        score += 20;
    }
    if (hasSpecialChar) {
        score += 20;
    }

    const severity = {
        0: "red",
        20: "red",
        40: "orange",
        60: "yellow",
        80: "blue",
        100: "green"
    }

    const meter_severity = {
        0: "red",
        35: "red",
        65: "yellow",
        100: "green"
    }

    let message = "Weak";
    let meter = 0;

    if (score === 0) {
        message = "Weak";
        meter = 0;
    }
    else if (score > 0 && score < 35) {
        message = "Weak";
        meter = 35;
    }
    else if (score >= 35 && score < 65) {
        message = "Medium";
        meter = 65;
    }
    else if (score >= 65 && score < 100) {
        message = "Strong";
        meter = 65;
    }
    else if (score === 100) {
        message = "Strong";
        meter = 100;
    }



    return {
        isMinLength, hasLowercase, hasUppercase, hasDigit, hasSpecialChar, combinedCriterias, score, severity: severity[score],
        meter, message, meter_severity: meter_severity[meter]
    };
}

export const FieldPassword = forwardRef(function FieldPassword(props, ref) {

    const formContextValues = useFormContext();
    const { errors, getValues, fieldValues, fieldDynamicConfig, DCKey } = useFormContext();
    const fieldProps = new FieldProperties(props, formContextValues);
    const op = useRef(null);
    const [defaultValue, setDefaultValue] = useState("");
    const [value, setValue] = useState("");
    const [passwordMeter, setPasswordMeter] = useState(20);
    const [criteriaScore, setCriteriaScore] = useState(testPassword(value));
    const validatePass = props.hasOwnProperty("validatePass") ? (props?.validatePass === undefined) ? true : props?.validatePass : false;
    const [defaultConfig] = useState({
        readOnly: props?.readOnly ?? false,
        disabled: props?.disabled ?? false,
        rules: {
            required: props?.rules?.required ?? props?.required ?? false,
            pattern: props?.rules?.pattern ?? props?.pattern ?? (validatePass) ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/ : /.*/,
            validate: props?.validate
        },
        noast: propBool(props, "noast"),

        feedback: props.hasOwnProperty("feedback") ? (props?.feedback === undefined) ? true : props?.feedback : false,
    });
    const [peek, setPeek] = useState(false);
    const [dynamicConfig, setDynamicConfig] = useState({
    });

    const [config, setConfig] = useState(defaultConfig);

    const input = useRef(null);




    useEffect(() => {
        setDynamicConfig(fieldProps.registerDynamicConfig(fieldDynamicConfig, defaultConfig));
        // console.log("fieldDynamicConfig", fieldDynamicConfig);
    }, [fieldDynamicConfig]);


    useEffect(() => {
        // console.log(defaultConfig);

        fieldProps.registerComponents({
            config: config
        });

        return () => {
            fieldProps.unMount();
        };

    }, []);

    useEffect(() => {

        const nConfig = dynamicConfig?.[DCKey] ?? defaultConfig;
        setConfig(nConfig);


    }, [dynamicConfig, DCKey]);


    const handleFieldValue = async (fieldValues) => {
        await fieldProps.setFFVal(fieldValues);
        setValue(getValues(fieldProps.getField()));
        setCriteriaScore(testPassword(getValues(fieldProps.getField())));
    }
    useEffect(() => {
        handleFieldValue(fieldValues);
    }, [fieldValues]);


    const handleOnChange = (e) => {
        const _value = e?.target?.value ?? e?.value ?? "";
        fieldProps.setAndCall(_value, setValue);
        setCriteriaScore(testPassword(_value));
    }


    // useEffect(() => {
    //     console.log(criteriaScore);
    // }, [criteriaScore])

    const isPassed = (bool) => {
        return (bool) ? "fas fa-check text-success" : "fas fa-times text-danger";
    };

    return (
        <div className="flex flex-column align-items-start">

            <div>
                {(config.rules.required === true && config.noast === false) ? (<span className='text-danger'><b>*</b> </span>
                ) : (<></>)}
                <LabelField field={fieldProps.getField()} label={fieldProps.getLabel()} />

            </div>
            {/*  */}
            <div className="p-inputgroup flex-1">

                <InputText id={fieldProps.getField()}
                    ref={input}
                    value={value}
                    type={(peek) ? 'text' : 'password'}
                    className={fieldProps.toggleErrClass(errors)}
                    placeholder={fieldProps.getPlaceHolder()}
                    readOnly={config?.readOnly ?? false}
                    disabled={config?.disabled ?? false}

                    onFocus={(e) => {
                        op.current.toggle(e);
                    }}
                    onBlur={(e) => {
                        op.current.toggle(e);
                    }}

                    onChange={handleOnChange} />
                <span className="p-inputgroup-addon" role='button' onClick={() => setPeek((prev) => {
                    return !prev;
                })}>
                    <i className={(peek) ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
            </div>

            <OverlayPanel hidden={!config.feedback} ref={op} style={{ width: "45%" }} className='align-self-center'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <ProgressBar value={criteriaScore.score} displayValueTemplate={() => {
                            return <></>
                        }} color={criteriaScore.severity} style={{ height: "12px" }}></ProgressBar>
                    </div>
                    <div className='col-lg-12 mb-1 mt-1'>
                        <b><label>{criteriaScore.message}</label></b>
                    </div>
                    <hr></hr>
                    <div className='col-lg-12'>
                        <i className={`${isPassed(criteriaScore.isMinLength)}`}></i> Minimum of 8 characters
                    </div>
                    <div className='col-lg-12'>
                        <i className={`${isPassed(criteriaScore.hasLowercase)}`}></i> At least one lowercase
                    </div>
                    <div className='col-lg-12'>
                        <i className={`${isPassed(criteriaScore.hasUppercase)}`}></i> At least one uppercase
                    </div>
                    <div className='col-lg-12'>
                        <i className={`${isPassed(criteriaScore.hasDigit)}`}></i> At least one numeric
                    </div>
                    <div className='col-lg-12'>
                        <i className={`${isPassed(criteriaScore.hasSpecialChar)}`}></i> At least one special character
                    </div>
                </div>

            </OverlayPanel>


            {/*  */}

            <HelperField helper={fieldProps.getHelper()} />


            <ErrorField field={fieldProps.getField()} />

        </div>
    )


});


// console.log(.test("ASDasd"))

// Test the password
// console.log(/.*[a-z]/.test(null));