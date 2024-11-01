import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
// import { useAuthContext } from '../../Contexts/AuthContext';
import { useAuthContext } from '../../components/auth/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { user, signOut } = useAuthContext();

    const navigate = useNavigate();

    // // console.log(authCtx.user);


    return (
        <Dropdown className="nav-item dropdown no-arrow" as="li">
            <Dropdown.Toggle className="epro-accordion nav-link dropdown-toggle" as="a" role='button' aria-haspopup="true" aria-expanded="false">
            {/* <img className="img-profile rounded-circle  mr-2" 
                    src={user?.profile}></img> */}

                <span className="epro-icon d-none d-lg-inline small">{user?.["username"] || user?.["name"] || ""} {user?.["last_name"] || ""}</span>
                
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-right shadow animated--fade-in"
                aria-labelledby="alertsDropdown" >
                
                <Dropdown.Item href="" onClick={()=>navigate("/main/profile_details")} className="dropdown-item">
                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                    Profile
                </Dropdown.Item>

                {/* <Dropdown.Item href="" className="dropdown-item">
                    <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                    Settings
                </Dropdown.Item>

                <Dropdown.Item href="" className="dropdown-item">
                    <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                    Activity Log
                </Dropdown.Item> */}
                {/* <div className="dropdown-divider"></div> */}

                <Dropdown.Item href="" onClick={() => {
                    signOut();
                }} className="dropdown-item">
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
};

export default Profile;