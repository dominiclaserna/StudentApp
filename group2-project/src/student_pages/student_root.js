import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import {Link} from "react-router-dom";

export default function StudentRoot() {
    const userId = localStorage.getItem("user")
    const [isLoggedIn, setIsLoggedIn] = useState(useLoaderData())
    const navigate = useNavigate()

    const [userName, setUserName] = useState("")
    
    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/")
        }
        fetchUser();
      }, [isLoggedIn, navigate])

    //PUT THIS ON A BUTTON TO LOGOUT
    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");

        localStorage.removeItem("user");
        localStorage.removeItem("usertype");
        setIsLoggedIn(false)
    }

    //SAMPLE USAGE ONLY
    const fetchUser = async() => {
      await fetch("http://localhost:3001/get-user-by-id", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({_id: userId})
      })
        .then(response => response.json())
        .then(body => {
            setUserName(body.fname) //GET THE SHIT YOU NEED FROM THIS
        })
    }
        return(
            <>
            <header id ="headerdiv">
          <div id="logo">
              <img src="https://static.cdnlogo.com/logos/m/39/minexcoin.svg" alt="logo"/>
              <h1>UPLB Clearance</h1>
              <nav>
        <ul id="NavBarUL">
            <li><Link to={"/home"}>Home</Link></li>        
        </ul>
      </nav>
          </div>
          <div id="headerbuttons">
              <p>{userName} | </p>     
                <button id ="logoutbutton" onClick={logout}> Log Out</button>
            <div id="extraspace">
            </div>
          </div>          
      </header>
            <Outlet />
            </>
        );
    }