

import { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Main.css";
import SideBar from "../../body/SideBar/SideBar"
import TopBar from "../../body/TopBar/TopBar"
import Container from 'react-bootstrap/Container';

function Main() {

  const [sideBarToggled, setSideBarToggled] = useState(false);

  const handleSBToggle = () => {
    setSideBarToggled(!sideBarToggled);

  };
  return (
    <div className={sideBarToggled ? 'main-body sidebar-toggled' : 'main-body'} id="page-top">

      <div id="wrapper">

        <SideBar sideBarToggled={sideBarToggled} handleSBToggle={handleSBToggle}></SideBar>
        {/* style={{background:"#0a0a0a"}} */}
        <div id="content-wrapper" style={{ background: "#0a0a0a" }} className="d-flex flex-column">
          <div id="content">
            <TopBar handleSBToggle={handleSBToggle}></TopBar>
            <Container fluid>
              <Outlet />
            </Container>
          </div>

          <footer className="sticky-footer bg-sec mt-5">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                {/* <span>Copyright &copy; Your Website 2020</span> */}
              </div>
            </div>
          </footer>
        </div>
      </div>
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>

    </div>
  );
}

export default Main;