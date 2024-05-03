//this will be the screen for creating an approver in the accoutn of admin!

import { Link, useNavigate } from "react-router-dom";
import {useState} from 'react';

export default function AddApprover() {
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  const [snum, setSnum] = useState('');
  const [emaili, setEmail] = useState('');
  const [passwordi, setPassword] = useState('');

  const navigate = useNavigate();

  const signup = event => {
    event.preventDefault(); // prevent page refresh
    signUpUser();
  };

  //creating the account of the approver!
  const signUpUser = async() => {
    await fetch("http://localhost:3001/signup", {
      method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fname: fname, mname: mname, lname: lname, snumber: snum, usertype: "approver", email: emaili, password: passwordi})
    }) 
        .then(response => response.json())
        .then(body => {
          if (body.success) { alert("Successfully saved User"); }
          else { alert("Failed to save user"); }
          console.log(body)
        })
        navigate(-1);
  }

    return(
      <div class="appbg">
      <div id="flex-admin-container">
        {/* <img src='https://i.pinimg.com/originals/29/17/ba/2917ba685656ff6a2fd317ecb55e95aa.png' className='bg-img'></img> */}
        <div className="addapprover">
          <p class='textapp'>ADD APPROVER</p>
          <form id="createapprover" onSubmit={signup}>
            <div class="iconbox">
              <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <input id="s-fname" placeholder="First Name" className="" onInput={e => setFname(e.target.value)} required/>
            <div class="iconbox">
              <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <input id="s-mname" placeholder="Middle Name" className="" onInput={e => setMname(e.target.value)} required/>
            <div class="iconbox">
              <i class="fa fa-user" aria-hidden="true"></i>
            </div>
            <input id="s-lname" placeholder="Last Name" className="" onInput={e => setLname(e.target.value)} required/>
            <div class="iconbox"><i class="fa fa-vcard" aria-hidden="true"></i></div>
            <input id="s-snum" placeholder="Employee Number" className="" onInput={e => setSnum(e.target.value)} required/>
            <br />
            <div class="iconbox"><i class="fa fa-envelope" aria-hidden="true"></i></div>
            <input id="s-email" placeholder="UP Mail" className="" onInput={e => setEmail(e.target.value)} required/>
            <br />
            <div class="iconbox"><i class="fa fa-key" aria-hidden="true"></i></div>
            <input id="s-password" type="password" placeholder="Password" className="" onInput={e => setPassword(e.target.value)} required/>
            <br />
            <button id='createappbtn' value="submit">Create Account</button>
          </form>
          <br /><br />
        </div>
      </div>
      </div>
    );
}