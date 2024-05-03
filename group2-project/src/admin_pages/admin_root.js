import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Cookies from "universal-cookie";
//import './admin.css';

export default function AdminRoot() {
  const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
  const navigate = useNavigate()

  useEffect(() => {
      if (!isLoggedIn) {
        navigate("/")
      }
    }, [isLoggedIn, navigate])

  //PUT THIS ON A BUTTON TO LOGOUT
  function logout() {
      const cookies = new Cookies();
      cookies.remove("authToken", {path: "/"});
      localStorage.removeItem("user");
      localStorage.removeItem("usertype");
      setIsLoggedIn(false)
  }

    return(
      <div class="bgbgbg">
              <header id ="headerdiv">
          <div id="logo">
              <img src="https://static.cdnlogo.com/logos/m/39/minexcoin.svg" alt="logo"/>
              <h1>UPLB Clearance</h1>
              <nav>
            <ul id="NavBarUL">
                <li><Link to={"/admin"}>Manage Students</Link></li>
                <li><Link to={"/admin/approver-list"}>Manage Approvers</Link></li>
            </ul>
          </nav>
          </div>
          <div id="headerbuttons">        
                <button id ="logoutbutton" onClick={logout}> Log Out</button>
            <div id="extraspace">
            </div>
          </div>
      </header>
      <Outlet />
    </div>
  );
}