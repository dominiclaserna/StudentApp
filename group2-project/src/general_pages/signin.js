import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

export default function SignIn() {
  const [emaili, setEmail] = useState('');
  const [passwordi, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  var usertype = localStorage.getItem('usertype');
  useEffect(() => {
    if (isLoggedIn) {
      if(usertype == 'superuser') {
        navigate("/admin");
      }else if(usertype == 'student') {
        navigate("/home");
      }else if(usertype == 'approver') {
        navigate("/approver");
      }
    }
  }, [isLoggedIn, navigate])


  const login = event => {
    event.preventDefault(); // prevent page refresh
    loginUser();
  };

  const loginUser = async() => {
    await fetch("http://localhost:3001/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({email: emaili, password: passwordi})
      })
        .then(response => response.json())
        .then(body => {
          if (body.success) {
            setIsLoggedIn(true)
            // successful log in. store the token as a cookie
            const cookies = new Cookies()
            cookies.set(
              "authToken",
              body.token,
              {
                path: "localhost:3001/",
                age: 60*60,
                sameSite: false
              });
            localStorage.setItem("user", body.user);
            localStorage.setItem("usertype",body.usertype);
          }
          else { alert("Log in failed")}
        })
  }

    return(
      <>
      <div className="flex-container">
        <div class='signindesign1'></div>
        <img class='neonbg' src='https://i.pinimg.com/originals/94/90/98/949098d4cc6e5e04247ee395d897f68f.png' />
        <div className="login-box">
          <p className="welcome">WELCOME</p>
          <form id="log-in" onSubmit={login}>
            <p className="label">EMAIL</p>
            <div class="icons-sign">
              <i class="iconsgn fa fa-envelope"></i>
              <input id="l-email" placeholder='Enter your email' onInput={e => setEmail(e.target.value)} required/>
            </div>
            <p className="label">PASSWORD</p>
            <div class="icons-sign">
              <i class="iconsgn fa fa-expeditedssl"></i>
              <input id="l-password"  placeholder='Enter your password' type="password" onInput={e => setPassword(e.target.value)} required/>
            </div>
            <button id='lgnbtn' className="loginbutton" >LOGIN</button>
          </form>
          <p id='donthaveanacc'>Don't have an account? <Link to={"/signup"}><a href="#" className="linksignup">Sign Up</a></Link></p>
          <img src='https://i.pinimg.com/originals/bf/cc/2e/bfcc2e0f376602eeee6ab1365635f543.png' class='imgside'></img>
        </div>
      </div>
      </>
    );
}
