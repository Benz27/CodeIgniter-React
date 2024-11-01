
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePopAlertContext } from "../contexts/PopAlertContext";

export const PopAlert = () => {
    // const { popAlertRef } = usePopAlertContext();
};

export const PopAlertComponent = forwardRef(function PopAlertComponent(props, ref) {
    const { visible, setVisible, popAlertRef,
        content, setContent,
        closeOnEscape, setCloseOnEscape,
        closeable, setCloseable,

        header, setHeader, } = usePopAlertContext();
    const onCloseRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            fire({
                content: content = "",
                closeOnEscape: closeOnEscape = true,
                closeable: closeable = true,
                header: header = "",
                onClose: onClose = () => { }
            }) {
                setVisible(true);
                setContent(content);
                setCloseOnEscape(closeOnEscape);
                setCloseable(closeable);
                setHeader(header);
                const _onClose = (typeof onClose === "function") ? onClose : () => { };
                onCloseRef.current = _onClose;
            },
            close() {
                setVisible(false);
            },
        };
    }, []);


    return (
        <div className="flex justify-content-center">
            <Dialog header={header} closable={closeable} visible={visible} style={{ width: '25vw' }} closeOnEscape={closeOnEscape}
                onHide={() => {
                    setVisible(false);
                    onCloseRef.current();
                }}>
                {/* {content} */}
                {/* <button onClick={() => setVisible(false)}>Close</button> */}
                <PopAlertBody content={content}></PopAlertBody>

                
            </Dialog>

        </div>
    )
})

const PopAlertBody = (props) => {

    const { content } = props;
    const Content = () => { return <>{content}</> };
    // const Content = () => {(<></>)};

    return (
        <Content />
    )
}







// const some = (A) => (B) => {
//     console.log(A, B);
// }

// const kk = some("A");

// kk("B");