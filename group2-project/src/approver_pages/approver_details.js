/*
This screen will show the clearance request of the uset
subject for approval of the approver!!
*/

import { useParams , useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";

export default function ApproverDetails(){
    const navigate = useNavigate();
    const [resend, setResend] = useState(false);
    const userId = localStorage.getItem("user");

    let { id } = useParams();
    const [applicationinfo, setApplicationInfo] = useState({});
    const [step, setStep] = useState('');
    const [remarksInput, setRemarksInput] = useState('');

    
    //this will fetch the getsubjectcode in the express and it will be utilized to get the 
    // other values or infos about that code since it will return all the inputs of the subject
    const FindInfos = () => {
        fetch(`http://localhost:3001/get-application-by-id?id=${id}`)     //code used in subjects will be utilized to find the whole data
        .then(response => response.json())
        .then(body => {
            setApplicationInfo(body);
            setStep(body.step);
        })
    }
    
    //this will just go back
    const navigateBack = () => {
        navigate(-1);
    }

    //using useEffect to ensure na no need to refresh  and this is the responsible for calling findinfos
    useEffect(() => {
        FindInfos();
      }, [id]);
    
    // Function for approving the clearance application
    async function approveClearance() {
        setResend(false)
        var step = 3;
        try {
            await fetch("http://localhost:3001/approve-application", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: id, step: step})
            }).then(response => response.json())
            .then(body =>{
                if (body.success) {
                    alert("Approved Successfully")
                } else {
                    alert("Failed to Approve")
                }
                navigate(-1);
            });
        } catch (error) {
            console.error("An error occured: ", error);
            // This handles the error appropriately
        }
    }

    //check if all fields are filled
    function checkRemarksField() {
        const currentDate = new Date();
        const rejectStep = 2

        if (remarksInput === "") {
            alert("Please Enter Your Remarks");
        } else {
            var remarks = {remark: remarksInput, date: currentDate, commenter: userId, stepgiven: rejectStep}

            rejectClearance(remarks);
        }
    }

    //function for rejecting the clearance application!
    async function rejectClearance(remark) {
        try {
            await fetch("http://localhost:3001/return-application", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: id, step: 2, remark: remark})
            }).then(response => response.json())
            .then(body => {
                if (body.success) {
                    alert("Returned Successfully")
                } else {
                    alert("Failed to Approve")
                }
                navigate(-1);
            });
        } catch (error) {
            console.error("An error occured: ", error);
            // This handles the error appropriately
        }
    }
    
      return (
        <div class="approve-details">
            <div id="ApplicationDetailsSection">
                <h1>Clearance Application Request Details </h1>
                <h2> Application ID: {applicationinfo._id} </h2>
                <h3>Link Submitted:</h3>
                <p>{applicationinfo.studentsubmission?.link}</p>
                <h3>Remarks:</h3>
                {applicationinfo.remarks &&
            applicationinfo.remarks.map((remark, i) => (
                <div id="approverremarkscontent">
                <h3 key={i}> Step {remark.stepgiven}: {remark.remark} </h3>
                <p>Commenter: {remark.commenter} </p>
                </div>
            ))}
            <br/>
                {(step == 1 || step == 2) && applicationinfo.status == "open" ? <>
                <button id="ApproveButton" onClick={() => approveClearance()}> Approve </button>

                <button id="RejectButton" onClick={() => setResend(true)}> Return with Remarks </button>
                </> : <></>}
                
                {resend &&
                    <form id="RemarksSections">
                        <label for='RemarksField'> Remarks: </label>
                        <br />
                        <input type='text' id='RemarksField' onInput={e => setRemarksInput(e.target.value)}></input>
                        <button id='ReturnButton' onClick={() => checkRemarksField()}> Return </button>
                    </form>
                }
                <button onClick={navigateBack}>Back</button>
            </div>
        </div>
    )

}