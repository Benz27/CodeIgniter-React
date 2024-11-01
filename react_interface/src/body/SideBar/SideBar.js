import { useContext, useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Nav from 'react-bootstrap/Nav';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { useLocation, NavLink } from 'react-router-dom';
// import learned_admin from '../../assets/img/learned_admin.png'
import './SideBar.css'
function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const handleOnclick = () => {
    decoratedOnClick();
    // handleAccordionToggle();
  }

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Nav.Link
      className={isCurrentEventKey ? "" : "collapsed"}
      onClick={handleOnclick}
      data-toggle="collapse"
    >
      {children}
    </Nav.Link>
  );
}



function AccordionNavLink({ children, eventKey, callback, to }) {

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const handleOnclick = () => {
    decoratedOnClick();
  }


  return (
    <NavLink
      className="nav-link"
      onClick={handleOnclick}
      to={to}

    >
      {children}
    </NavLink>
  );
}




// function ActiveNavItem({ pages }) {
//   const location = useLocation();
//   const [pathnameSegments, setPathnameSegments] = useState([]);

//   useEffect(() => {
//     const segments = location.pathname.split('/').filter(segment => segment !== '');
//     setPathnameSegments(segments);
//   }, [location.pathname]);


//   if (pages.includes(pathnameSegments[0])) {
//     return 'active'
//   }

//   return '';

// }

function AccordionNavItem({ activeRoute, route, children }) {


  var classActive = '';
  if (activeRoute == route) {
    classActive = 'active'
  }

  return (
    <Nav.Item as="li" className={classActive}>
      {children}
    </Nav.Item>
  );
}

function SideBar({ sideBarToggled, handleSBToggle }) {
  const baseClassName = 'navbar-nav bg-partner sidebar sidebar-dark';
  const toggledClassName = sideBarToggled ? 'toggled' : '';
  const combinedClassName = `${baseClassName} ${toggledClassName}`;

  const routes = {
    "dashboard": "0",
    "components": "1",
    "utilities": "2",
    "pages": "3",
    "charts": "4",
    "tables": "5"
  };


  const [activeRoute, setActiveRoute] = useState(null);

  const location = useLocation();

  const StartingKey = location.pathname.split('/').filter(segment => segment !== '');


  useEffect(() => {
    const segments = location.pathname.split('/').filter(segment => segment !== '');

    setActiveRoute(segments[1] ?? "");
    console.log("activeRoute", location.pathname);
  }, [location.pathname]);



  return (
    // Accordion defaultActiveKey="0"
    <Accordion className={combinedClassName} as="ul" defaultActiveKey={routes[StartingKey[1]]}>

      <a className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon fas fa-feather-alt">
        </div>
        <div className="sidebar-brand-text mx-3">Blog <span className='brand-Pro'>Poster</span></div>
      </a>
      <hr className="sidebar-divider my-0"></hr>

      <AccordionNavItem activeRoute={activeRoute} route="">
        <NavLink className="nav-link" activeClassName='nav-link active' to="/main/">
          <i className="fas fa-fw fa-home"></i>
          <span >Home</span></NavLink>
      </AccordionNavItem>

      <hr className="sidebar-divider d-none d-md-block"></hr>

      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" onClick={handleSBToggle}></button>
      </div>


    </Accordion>
  );
}

export default SideBar;











// // Define the regular expression
// const regex = /^\/main\//;

// // Example strings
// const str1 = "/main/example";
// const str2 = "/other/example";

// // Function to check if a string starts with "/main/"
// function startsWithMain(str) {
//   return regex.test(str);
// }

// // Test the function
// console.log(startsWithMain(str1)); // Output: true
// console.log(startsWithMain(str2)); // Output: false