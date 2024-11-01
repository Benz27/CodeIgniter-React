import { useEffect, useRef } from "react";
import { FormContextProvider, useFormContext } from "../../../components/form/contexts/FormContext";
import { FieldText } from "../../../components/form/fields/FieldText";
import { useGlobalStateContext } from "../../../components/config/contexts/GlobalStateContext";
import { useState } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { FieldTextArea } from "../../../components/form/fields/FieldTextArea";
import { useAuthContext } from "../../../components/auth/contexts/AuthContext";
import { usePopAlertContext } from "../../../components/pop-alert/contexts/PopAlertContext";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";


const MainForm = ({ onCreate: _onCreate, onModify: _onModify, ...props }) => {
    const { onDone, toast, DCKey, setFieldValues, registerSubmission, setDCKey, submit, resetAllRegistries } = useFormContext();
    const { registry } = useGlobalStateContext();
    const configCtx = useGlobalStateContext();
    let config_id = "BlogPost";
    const authCtx = useAuthContext();

    const [data, setData] = useState(undefined);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const { popAlertRef } = usePopAlertContext();
    const onCreate = (typeof _onCreate === "function") ? _onCreate : () => { };
    const onModify = (typeof _onModify === "function") ? _onModify : () => { };


    useEffect(() => {
        onDone(() => {
            popAlertRef.current.close();
            setBtnDisabled(false);
        });
    }, []);

    let doc_id = null;
    const mainMod = (data) => {
    };
    const create = async (data) => {
        popAlertRef.current.fire({
            header: "Creating blogpost....",
            closeable: false,
            content: () => {
                return <div className="flex justify-content-center">
                    <ProgressSpinner />
                </div>
            }
        });
        const _data = data.data;
        await axios.post(`http://localhost:8080/api/blog/`, _data, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            console.log(response.data);
            configCtx.set({ key: config_id, value: _data });
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'BlogPost Created.', life: 3000 });
            _data["created_at"] = response.data.created_at;
            _data["user_id"] = authCtx.user.id;
            onCreate(response.data.insertID, _data);
        })
        .catch(error => {
            console.error(error);
            throw new Error(error);
        });
        popAlertRef.current.close();
        setBtnDisabled(false);
    };
    const modify = async (data_) => {
        popAlertRef.current.fire({
            header: "Modifying blogpost....",
            closeable: false,
            content: () => {
                return <div className="flex justify-content-center">
                    <ProgressSpinner />
                </div>
            }
        });
        const _data = data_.data;
        await axios.put(`http://localhost:8080/api/blog/${data.id}`, _data, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            configCtx.set({ key: config_id, value: _data });
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'BlogPost Modified.', life: 3000 });
            onModify(data.id, _data);
        })
        .catch(error => {
            console.error(error);
            throw new Error(error);
        });
        popAlertRef.current.close();
        setBtnDisabled(false);
    };
    // 
    // const rend = useRef(0);
    // useEffect(() => {
    //     rend.current++;
    //     console.log(`Render count: ${rend.current}`);
    // })
    const initialize = () => {
        if (!data) {
            setFieldValues(null);
            setDCKey("create");
            return;
        }
        doc_id = data?.id;
        setFieldValues(data);
        setDCKey("modify");
    };
    // 

    useEffect(() => {
        setData(registry?.[config_id]?.get());
    }, [registry[config_id]]);

    useEffect(() => {
        resetAllRegistries();
        registerSubmission("create", create);
        registerSubmission("modify", modify);
        initialize();
    }, [data]);


    return (
        <>
            <Toast ref={toast} />

            <FieldText required={true} field="title" label="Title" placeholder="Set the title..."></FieldText>
            <FieldTextArea required={true} field="content" label="Content" placeholder="Set the content..."></FieldTextArea>

            {(DCKey === "modify") ? (
                <Button className="my-2"
                    label="Modify" severity="primary" disabled={btnDisabled} onClick={(e) => {
                        setBtnDisabled(true);
                        submit(e);
                    }} />
            ) : (
                <Button className="my-2" disabled={btnDisabled} label="Create" severity="success" onClick={(e) => {
                    setBtnDisabled(true);
                    submit(e);
                }} />
            )}
        </>)
}

export const BlogPostForm = (props) => {
    return (<FormContextProvider><MainForm {...props}/></FormContextProvider>)
}