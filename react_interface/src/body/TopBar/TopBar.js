
import ProfilePanel from "../Profile/Profile";
function TopBar({ handleSBToggle }) {
    return (
        <nav className="navbar navbar-expand navbar-light bg-sec topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" onClick={handleSBToggle} className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>



            <ul className="navbar-nav ml-auto">


                <li className="nav-item dropdown no-arrow d-sm-none">
                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-search fa-fw"></i>
                    </a>

                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                        aria-labelledby="searchDropdown">
                        <form className="form-inline mr-auto w-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    placeholder="Search for..." aria-label="Search"
                                    aria-describedby="basic-addon2"></input>
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>
{/* 
                <AlertsCenter></AlertsCenter>

                <MessageCenter></MessageCenter> */}

                <div className="topbar-divider d-none d-sm-block"></div>


                <ProfilePanel></ProfilePanel>

            </ul>
        </nav>
    )
};


export default TopBar;