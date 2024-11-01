import logo from './logo.svg';
import './App.css';
import './assets/css/project.css'
import './assets/fontawesome-free/css/all.min.css'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import AuthContextProvider, { useAuthContext } from './components/auth/contexts/AuthContext';
import { PopAlertContextProvider, usePopAlertContext } from './components/pop-alert/contexts/PopAlertContext';
import { PopAlertComponent } from './components/pop-alert/components/PopAlert'
import { GlobalStateContextProvider } from './components/config/contexts/GlobalStateContext';
import { useEffect } from 'react';
import axios from 'axios';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Main/Home/Home';
import { ProfileDetails } from './pages/Profile/ProfileDetails';


function AuthNavigation() {
  return (
    <Routes>
      <Route exact path="/" element={
        <Login />
      } />
      <Route exact path="/register" element={
        // <Register />
        <Register />
      } />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};
function AuthenticatedNavigation() {
  return (
    <Routes>
      <Route path="/main" element={<Main />}>
        <Route exact path="" element={<Home />} />
        <Route exact path="profile_details" element={<ProfileDetails />} />
      </Route>

      <Route path="/" element={<Navigate replace to="/main" />} />

    </Routes>)

}
function Navigation() {

  const { registerSignOut, isAuthenticated, authenticate, signOut, checkSession } = useAuthContext();

  const { popAlertRef } = usePopAlertContext();

  useEffect(() => {
    checkSession();
  }, []);


  return (
    <BrowserRouter>
      {/* <AuthNavigation /> */}
      <PopAlertComponent ref={popAlertRef} />
      {isAuthenticated ? (
        <AuthenticatedNavigation />
      ) : (
        <AuthNavigation />
      )}
    </BrowserRouter>
  );
};


function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <PopAlertContextProvider>
          <GlobalStateContextProvider>
            <Navigation></Navigation>
          </GlobalStateContextProvider>
        </PopAlertContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
