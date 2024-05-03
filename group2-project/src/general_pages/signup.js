import { Link, useNavigate } from "react-router-dom";
import {useState} from 'react';

export default function SignUp() {
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  const [snum, setSnum] = useState('');
  const [emaili, setEmail] = useState('');
  const [passwordi, setPassword] = useState('');

  const navigate = useNavigate();

  const signup = event => {
    event.preventDefault(); // prevent page refresh
    CreateUserReq();
    
  };

  // Function for sending an account request
  const CreateUserReq = async() => {
    if (passwordi.length < 6) {
      alert("Password length is too short! Please use 6 or more characters.")
    }
    else {
    await fetch("http://localhost:3001/add-request", {
      method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fname: fname, mname: mname, lname: lname, snumber: snum, usertype: "student", email: emaili, password: passwordi, applications: [], adviser: null})
    }) 
        .then(response => response.json())
        .then(body => {
          if (body.success) { 
            alert("Please wait for your request to be accepted."); 
            navigate(-1);
        }
          else { 
            alert(body.message); 
          }
        })
      }
  }

    return(
      <>
      <div className="flex-container">
      <div class='signindesign2'></div>
        <img class='neonbg' src='https://i.pinimg.com/originals/94/90/98/949098d4cc6e5e04247ee395d897f68f.png' />
        <div className="login-box">
          <p className="welcome">SIGN UP</p>
          <form id="sign-up" onSubmit={signup}>
            <div class="icons-signup">
              <i class="iconsgn fa fa-user"></i>
              <input id="s-fname" placeholder="First Name" className="inputs" onInput={e => setFname(e.target.value)} required/>
            </div>
            <div class="icons-signup">
              <i class="iconsgn fa fa-user"></i>
              <input id="s-mname" placeholder="Middle Name" className="inputs" onInput={e => setMname(e.target.value)} required/>
            </div>
            <div class="icons-signup">
              <i class="iconsgn fa fa-user"></i>
              <input id="s-lname" placeholder="Last Name" className="inputs" onInput={e => setLname(e.target.value)} required/>
            </div>
            <div class="icons-signup">
              <i class="iconsgn fa fa-vcard"></i>
              <input id="s-snum" placeholder="Student Number" className="inputs" onInput={e => setSnum(e.target.value)} required/>
            </div>
            <div class="icons-signup">
              <i class="iconsgn fa fa-envelope"></i>
              <input id="s-email" placeholder="UP mail" className="inputs" type="email" onInput={e => setEmail(e.target.value)} required/>
            </div>
            <div class="icons-signup">
              <i class="iconsgn fa fa-expeditedssl"></i>
              <input id="s-password" type="password" placeholder="Password" className="inputs" onInput={e => setPassword(e.target.value)} required/>
            </div>
            <button id='signupbtn' className="loginbutton" value="submit">Create Account</button>
          </form>
          <p id='backtologin'>Already have an account? <Link to={"/"}><a href="#" className="linksignup">Log In.</a></Link></p>
          <img src='https://i.pinimg.com/originals/bf/cc/2e/bfcc2e0f376602eeee6ab1365635f543.png' class='suimgside'></img>
        </div>
      </div>
      </>
    );
}