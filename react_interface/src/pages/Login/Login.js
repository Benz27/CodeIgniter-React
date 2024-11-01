import { useEffect } from 'react';
import { FieldText } from '../../components/form/fields/FieldText';
import { FieldPassword } from '../../components/form/fields/FieldPassword';
import { FormContextProvider, useFormContext } from '../../components/form/contexts/FormContext';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../components/auth/contexts/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';

import "./Login.css";
import { usePopAlertContext } from '../../components/pop-alert/contexts/PopAlertContext';
import { Button } from 'primereact/button';
import axios from 'axios';
function Form() {
    const { popAlertRef } = usePopAlertContext();
    const { authenticate } = useAuthContext();
    const { registerDataModification, registerSubmission, registerMainModification, setDCKey, submit, resetAllRegistries } = useFormContext();
    const navigate = useNavigate();
    const login = async (data) => {
        popAlertRef.current.fire({
            header: "Logging in....",
            closeable: false,
            content: () => {
                return <div className="flex justify-content-center">
                    <ProgressSpinner />
                </div>
            }
        });
        await axios.post('http://localhost:8080/api/authentication/login', data.data)
        .then(response => {
            authenticate(response.data)
            popAlertRef.current.close();
            navigate("/main/");
        })
        .catch(error => {
            popAlertRef.current.fire({
                header:"Login Failed",
                content: "Invalid credentials...."
            });
            console.error(error);
        });

    }

    useEffect(() => {
        registerSubmission("", login);
    }, []);

    return (
        <div className="main-body body-yanga">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-xl-7 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-center pe-5 me-3">
                                    <h2 className="rotate-n-15">
                                        <i className="fas fa-feather"></i>
                                    </h2>
                                    <h3 className="text-center font-weight-light my-4 mx-3">
                                        Blog Poster
                                    </h3>
                                </div>
                            </div>

                            <div className="card-body p-0">
                                <div className="row">
                                    {/* <div className="col-lg-6 d-none d-lg-block bg-login-image"></div> */}

                                    <div className="col-lg-12">
                                        <div className="p-5">
                                            {/* <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">{DisplayName}</h1>
                                            </div> */}
                                            {/* <ProgressSpinner></ProgressSpinner> */}
                                            <form className="user">
                                                <div className="form-group">
                                                    {/* <input type="email" className="form-control form-control-user"
                                              id="exampleInputEmail" aria-describedby="emailHelp"
                                              placeholder="Enter Email Address..."></input> */}
                                                    <FieldText noast field="username" label="Username" required placeholder="Enter ypur username..."></FieldText>
                                                </div>
                                                <div className="form-group">
                                                    {/* <input type="password" className="form-control form-control-user"
                            id="exampleInputPassword" placeholder="Password"></input> */}
                                                    <FieldPassword noast label="Password" required field="password" placeholder="Enter you password..."></FieldPassword>

                                                </div>
                                                {/* <div className="form-group">
                                          <div className="custom-control custom-checkbox small">
                                              <input type="checkbox" className="custom-control-input" id="customCheck"></input>
                                              <label className="custom-control-label" for="customCheck">Remember
                                                  Me</label>
                                          </div>
                                      </div> */}
                                                {/* <button onClick={submit} className="btn btn-primary btn-user btn-block text-center">
                                                    Login
                                                </button> */}
                                                <hr></hr>
                                                <Button label="Log In" onClick={submit} />

                                            </form>
                                            <hr></hr>
                                            {/* <div class="text-center">
                                                <a class="small" href="forgot-password.html">Forgot Password?</a>
                                            </div> */}
                                            <div class="text-center">
                                                <a class="small" role='button' onClick={() => { navigate("/register") }}>Request an Account!</a>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
const Login = () => {
    return (
        <FormContextProvider>
            <Form></Form>
        </FormContextProvider>)

}
export default Login;