import { useEffect, useRef } from "react";
import { FormContextProvider, useFormContext } from "../../components/form/contexts/FormContext";
import { FieldText } from "../../components/form/fields/FieldText";
import { useState } from "react";
import { Button } from "primereact/button";

import { Toast } from 'primereact/toast';
import { useAuthContext } from "../../components/auth/contexts/AuthContext";
import axios from "axios";
import { FieldPassword } from "../../components/form/fields/FieldPassword";

const MainForm = () => {
    const { toast, DCKey, setFieldValues, registerSubmission, setDCKey, submit } = useFormContext();
    const authCtx = useAuthContext();
    const [data, setData] = useState(undefined);

    const save = async (data) => {
        const _data = data.data;
        console.log(_data);
        await axios.put('http://localhost:8080/api/authentication/profile', _data, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
            .then(response => {
                authCtx.setUser({
                    ...authCtx.user, ..._data
                });
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profile Details Modified.', life: 3000 });
            })
            .catch(error => {
                console.error(error);
                toast.current.show({ severity:'error', summary: 'Error', detail: "Something went wrong", life: 3000 });
            });


    };
    // 
    const initialize = () => {
        if (!data) {
            setFieldValues(null);
            setDCKey("create");
            return;
        }
        setFieldValues(data);
        setDCKey("save");
    }
    // 


    useEffect(() => {
        setData(authCtx.user);
    }, [authCtx.user]);

    useEffect(() => {
        registerSubmission("save", save);
        initialize();
    }, [data]);

    return (
        <>
            <Toast ref={toast} />

            <FieldText required={true} field="username" label="Username" placeholder="Set your username..."></FieldText>
            <FieldText required={true} field="email" label="Email" placeholder="Set your email..."></FieldText>

            <Button disabled={DCKey !== 'save'} className="my-2" label="Save" severity="primary" onClick={submit} />

            {/* <button onClick={() => { setDCKey("modify") }}>modify</button>
            <br></br>
            <button onClick={() => { setDCKey("compose") }}>compose</button> */}
        </>)
}


const Security = () => {
    const { toast, DCKey, setFieldValues, registerSubmission, setDCKey, submit } = useFormContext();
    const authCtx = useAuthContext();
    const [data, setData] = useState(undefined);

    const save = async (data) => {
        const _data = data.data;
        console.log(_data);
        await axios.put('http://localhost:8080/api/authentication/profile/changepass', _data, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
            .then(response => {
                setFieldValues({
                    password:"",
                    newpassword:"",
                    "confirm-password":"",

                });
                // authCtx.setUser(_data);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Password Changed.', life: 3000 });
            })
            .catch(error => {
                console.error(error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: "Something went wrong", life: 3000 });
            });
    };
    // 
    const initialize = () => {
        if (!data) {
            setFieldValues(null);
            setDCKey("create");
            return;
        }
        setFieldValues(data);
        setDCKey("save");
    }
    // 


    useEffect(() => {
        setData(authCtx.user);
    }, [authCtx.user]);

    useEffect(() => {
        registerSubmission("save", save);
        initialize();
    }, [data]);

    return (
        <>
            <Toast ref={toast} />

            <FieldPassword label="Password" placeholder="Enter your password..." field="password" required ></FieldPassword>
            <FieldPassword label="New Password" placeholder="Enter your new password..." field="newpassword" required ></FieldPassword>
            <FieldPassword label="Confirm New Password" validate={{
                same_with_pass: (value, data) => {
                    if (value !== data?.newpassword) {
                        return "New password and confirm password fields does not match.";
                    }
                }
            }} validateOnChange placeholder="Confirm your password..." field="confirm-password" required></FieldPassword>
            <Button disabled={DCKey !== 'save'} className="my-2" label="Save" severity="primary" onClick={submit} />

            {/* <button onClick={() => { setDCKey("modify") }}>modify</button>
            <br></br>
            <button onClick={() => { setDCKey("compose") }}>compose</button> */}
        </>)
}


export const ProfileDetails = () => {
    return (<>
    
    <FormContextProvider><MainForm /></FormContextProvider>
    <FormContextProvider><Security /></FormContextProvider>
    </>)
}