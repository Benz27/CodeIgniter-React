import { useEffect } from 'react';
import { FieldText } from '../../components/form/fields/FieldText';
import { FieldPassword } from '../../components/form/fields/FieldPassword';
import { FormContextProvider, useFormContext } from '../../components/form/contexts/FormContext';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../components/auth/contexts/AuthContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import "./Register.css";
import { usePopAlertContext } from '../../components/pop-alert/contexts/PopAlertContext';
import { Button } from 'primereact/button';
import axios from 'axios';
function Form() {
    const { popAlertRef } = usePopAlertContext();
    const { authenticate } = useAuthContext();
    const { registerDataModification, registerSubmission, registerMainModification, setDCKey, submit, resetAllRegistries } = useFormContext();
    const navigate = useNavigate();
    const register = async (data) => {
        try {
            popAlertRef.current.fire({
                header: "Processing your account request....",
                closeable: false,
                content: () => {
                    return <div className="flex justify-content-center">
                        <ProgressSpinner />
                    </div>
                }
            });

            await axios.post('http://localhost:8080/api/authentication/register', data.data).then(() => {
                popAlertRef.current.fire({
                    header: "Account Registered!",
                    closeable: false,
                    content: () => {
                        return <div className="flex justify-content-center">
                            {/* <ProgressSpinner /> */}
                            <div className='row'>
                                <div className='col-12'>
                                    Your account have been registered!
                                    </div>
                                <div className='col-12'>
                                    <Button label='Go back to log in' onClick={() => {
                                        popAlertRef.current.close();
                                        navigate("login/");
                                    }}></Button>
                                </div>
                            </div>

                        </div>
                    }
                });
            }).catch((err) => {
                popAlertRef.current.fire({
                    header: "Registration Failed",
                    content: "Something went wrong..."
                });
                console.error(err);
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        registerSubmission("", register);
    }, []);

    return (
        <div className="main-body body-yanga">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-xl-10 col-lg-12 col-md-9">

                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    {/* <div className="col-lg-6 d-none d-lg-block bg-login-image"></div> */}

                                    <div className="col-lg-12">
                                        <div className="p-5">
                                            <div className="card-header">

                                                <div className="d-flex align-items-center justify-content-center pe-5 me-3">
                                                    <h2 className="rotate-n-15">
                                                        <i className="fas fa-feather-alt"></i>
                                                    </h2>
                                                    <h3 className="text-center font-weight-light my-4 mx-3">

                                                    Blog Poster
                                                    </h3>


                                                </div>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    {/* <input type="email" className="form-control form-control-user"
                                              id="exampleInputEmail" aria-describedby="emailHelp"
                                              placeholder="Enter Email Address..."></input> */}
                                                    <FieldText label="Username" validateOnChange field="username" required placeholder="Set your username..."></FieldText>
                                                </div>
                                                <div className="form-group">
                                                    {/* <input type="password" className="form-control form-control-user"
                            id="exampleInputPassword" placeholder="Password"></input> */}
                                                    <FieldText label="Email" validateOnChange field="email" required placeholder="Set your email address..."></FieldText>

                                                    <hr></hr>
                                                    <FieldPassword label="Password" placeholder="Enter your password..." field="password" required ></FieldPassword>
                                                    <FieldPassword label="Confirm Password" validate={{
                                                        same_with_pass: (value, data) => {
                                                            // console.log(value, data);
                                                            if(value !== data?.password){
                                                                return "Password and confirm password fields does not match.";
                                                            }
                                                        }
                                                    }} validateOnChange placeholder="Confirm your password..." field="confirm-password" required></FieldPassword>
                                                </div>
                                                {/* <div className="form-group">
                                          <div className="custom-control custom-checkbox small">
                                              <input type="checkbox" className="custom-control-input" id="customCheck"></input>
                                              <label className="custom-control-label" for="customCheck">Remember
                                                  Me</label>
                                          </div>
                                      </div> */}
                                                <Button label="Register Account" onClick={submit} />

                                                {/* <button onClick={submit} className="btn btn-primary btn-user btn-block">
                                                        
                                                    </button> */}

                                            </form>
                                            <hr></hr>
                                            {/* <div class="text-center">
                                                <a class="small" href="forgot-password.html">Forgot Password?</a>
                                            </div> */}
                                            <div class="text-center">
                                                <a class="small" role='button' onClick={() => { navigate("/") }}>Have an account? Log-In!</a>
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
const Register = () => {
    return (
        <FormContextProvider>
            <Form></Form>
        </FormContextProvider>)

}
export default Register;