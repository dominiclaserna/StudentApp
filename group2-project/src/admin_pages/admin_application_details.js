/*
This will be used to show the student account request details!
*/

import { useParams , useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";

export default function AdminApplicationDetails() {

    const navigate = useNavigate();

    let { snum } = useParams();
    const [userrequest, setRequest] = useState([]);
    
    //this will fetch the getsubjectcode in the express and it will be utilized to get the 
    // other values or infos about that code since it will return all the inputs of the subject
    const FindInfos = () => {
        fetch(`http://localhost:3001/get-user-request-by-snum?snum=${snum}`)     //code used in subjects will be utilized to find the whole data
        .then(response => response.json())
        .then(body => {
            setRequest(body)
        })
    }

    //using useEffect to ensure na no need to refresh  and this is the responsible for calling findinfos
    useEffect(() => {
        FindInfos();
      }, [snum]);

    //this function will be used to remove the request created by the user (declined)
    async function removeRequest(){
        try{
            await fetch("http://localhost:3001/delete-request",{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id:userrequest._id})
            })
            .then(response => response.json())
            .then(body=>{
                alert(`Successfuly removed ${userrequest.fname} from the requests list`);
                navigate(-1);
            })
        }catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
  }

    }

    //this function will be used to generate the account
    const acceptRequest = async() => {//gawin request
    
        fetch("http://localhost:3001/signup", {
          method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fname: userrequest.fname, mname: userrequest.mname, lname: userrequest.lname, snumber: userrequest.snumber, usertype: "student", email: userrequest.email, password: userrequest.password})
        }) 
            .then(response => response.json())
            .then(body => {
              if (body.success) { 
                alert("Successfully approve request.");
                removeRequest();}
              else { alert("Failed to save user"); }
            })
      }

    const navigateBack = () => {
        navigate(-1);
    }

    return (
        <div class="studentapp-details">
            <div class="studentapp-container">
                <div id="ApproveRejectSection">
                    <div id="SpecificDetails">
                        <h1> Student Account Request Details </h1>
                        <h3> Name: {userrequest.fname} {userrequest.mname} {userrequest.lname} </h3>
                        <h3> StudentNumber: {userrequest.snumber} </h3>
                        <h3>Email: {userrequest.email}</h3>
                    </div>
                    <div id="approverejectbuttons">
                        <button id="ApproveButton" onClick={acceptRequest}> Approve </button>
                        <button id="RejectButton" onClick={removeRequest} > Decline </button>
                    </div>

                    <button onClick={navigateBack}>Back</button>
                </div>
            </div>
        </div>
    )


}