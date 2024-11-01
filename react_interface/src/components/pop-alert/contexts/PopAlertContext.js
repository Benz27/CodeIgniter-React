import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const PopAlertContext = createContext();

export function usePopAlertContext() {
    return useContext(PopAlertContext);
}

export function PopAlertContextProvider({ children }) {
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState(false);
    const [closeOnEscape, setCloseOnEscape] = useState(true);
    const [closeable, setCloseable] = useState(true);
    const [header, setHeader] = useState("");

    const popAlertRef = useRef(null);

    const value = {
        visible, setVisible, popAlertRef,
        content, setContent,
        closeOnEscape, setCloseOnEscape,
        closeable, setCloseable,
        header, setHeader,

    };

    return (
        <PopAlertContext.Provider value={value}>
            {children}
        </PopAlertContext.Provider>

    )
}
