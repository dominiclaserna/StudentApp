/*  This will be used as screen to show the edit approver side of the admin
*/
import { useParams , useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";

export default function AdminEditApprover() {

    const navigate = useNavigate();

    let { id } = useParams();
    const [fname, setFname] = useState('');
    const [mname, setMname] = useState('');
    const [lname, setLname] = useState('');
    const [snum, setSnum] = useState('');
    const [emaili, setEmail] = useState('');
    const [passwordi, setPassword] = useState('');
    
    //this will fetch the getsubjectcode in the express and it will be utilized to get the 
    // other values or infos about that code since it will return all the inputs of the subject
    useEffect(() => {
        getUserById();
    }, [])
    const norefresh = event => {
        event.preventDefault();
        updateApprover();
    }

    //get info using id!
    const getUserById = async() => {
        await fetch("http://localhost:3001/get-user-by-id", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({_id: id})
        })
        .then(response => response.json())
        .then(body => {
            setFname(body.fname);
            setMname(body.mname);
            setLname(body.lname);
            setSnum(body.snumber);
            setEmail(body.email);
        })
    }

    //this will be used to update the data of the approver
    async function updateApprover() {
        try {
            await fetch("http://localhost:3001/update-approver", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: id, fname: fname, mname: mname, lname: lname, snumber: snum, email: emaili})
            }).then(response => response.json())
            .then(body => {
                if (body.success) {
                    alert("Successfully edited!");
                }
                else {
                    alert("Failed to edit!");
                }
                navigate(-1);
            });
            // Additional code after the fetch request if needed
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle the error appropriately
        }
    }

    return (
      <div class="bgbgbg">
      <div className="flex-container">
        {/* <img src='https://i.pinimg.com/originals/29/17/ba/2917ba685656ff6a2fd317ecb55e95aa.png' className='bg-img'></img> */}
        <div className="login-box">
          <p className="welcome">EDIT APPROVER</p>
          <form id="sign-up" onSubmit={norefresh}>
            <input id="s-fname" placeholder="First Name" className="inputs" value={fname} onInput={e => setFname(e.target.value)} />
            <input id="s-mname" placeholder="Middle Name" className="inputs" value={mname} onInput={e => setMname(e.target.value)} />
            <input id="s-lname" placeholder="Last Name" className="inputs" value={lname} onInput={e => setLname(e.target.value)} />
            <input id="s-snum" placeholder="Employee Number" className="inputs" value={snum} onInput={e => setSnum(e.target.value)} />
            <input id="s-email" placeholder="UP Mail" className="inputs" value={emaili} onInput={e => setEmail(e.target.value)} />
            <br />
            <button id='signupbtn' className="loginbutton" value="submit">Submit</button>
          </form>
          <br /><br />
          <img src='https://i.pinimg.com/originals/bf/cc/2e/bfcc2e0f376602eeee6ab1365635f543.png' class='suimgside'></img>
        </div>
      </div>
      </div>
    )
}