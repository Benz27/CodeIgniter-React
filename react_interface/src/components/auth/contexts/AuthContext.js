import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
    accessToken: "",
    authenticate: () => { },
    signOut: () => { },
    isAuthenticated: false,
    setSession: () => { },
    user: {},
    checkSession: () => {}

});

export function useAuthContext() {
    return useContext(AuthContext);
}

function AuthContextProvider({ children }) {
    const [accessToken, setAccessToken] = useState();
    const onAuthStatusChangeCallback = useRef(null);
    const signOutCallBack = useRef(null);

    const [user, setUser] = useState({

    });
    const [accessMap, setAccessMap] = useState({
        "Properties": [{ role: "Property Controller" }],
        "Funds": [{ role: "Cashier" }],
        "ToAuth": [{ role: "Head" }, { role: "Property Controller" }, { role: "Principal" }, { role: "Director" }],
    });

    function authenticate(cred) {
        console.log(cred);
        setAccessToken(cred.accessToken);
        setUser(cred.user);
        sessionStorage.setItem("accessToken", cred.accessToken);
        sessionStorage.setItem("user", JSON.stringify(cred.user));
    };

    function checkSession(){
        if(sessionStorage.getItem("accessToken") !== null && sessionStorage.getItem("user") !== null){
            authenticate({accessToken:sessionStorage.getItem("accessToken"), user:JSON.parse(sessionStorage.getItem("user"))});
        }
    }





    function signOut() {
        removeCredentials();

    };

    function removeCredentials() {
        setUser({});
        setAccessToken(null);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
    }

    function registerSignOut(fn) {
        signOutCallBack.current = (typeof fn === "function") ? fn : () => {
            console.warn("sign out callback must be a function! found: ", typeof fn === "function")
        };
    }

    const value = {
        accessToken: accessToken,
        authenticate: authenticate,
        isAuthenticated: !!accessToken,
        signOut: signOut,
        registerSignOut,
        removeCredentials,
        user: user,
        setUser: setUser,
        checkSession: checkSession
    };



    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const Access = (props) => {
    const { user, checkAccess } = useAuthContext();
    const [accessible, setAccesible] = useState(false);
    const name = props?.name;

    useEffect(() => {
        setAccesible(checkAccess({ priv: name }));
    }, [name, user])

    return (
        <>
            {accessible ? (
                <>{props?.children}</>
            ) : (
                <></>
            )}
        </>
    )
}



export default AuthContextProvider;


