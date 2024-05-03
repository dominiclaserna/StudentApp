//This will be the screen for resubmitting the application when it's returned.

import { useParams , useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";

export default function Resubmit() {
    //get userId
    const userId = localStorage.getItem("user");
    const navigate = useNavigate();

    let { id } = useParams();

    const [application, setApplication] = useState({});
    const [githubLink, setGithubLink] = useState('');
    const [remark, setRemark] = useState('');

    useEffect(() => {
        getApplication();
    }, [])
    
    const stopReloadSubmit = event => {
        event.preventDefault(); // prevent page refresh
    };

    const getApplication = () => {
        fetch(`http://localhost:3001/get-application-by-id?id=${id}`)     //code used in subjects will be utilized to find the whole data
        .then(response => response.json())
        .then(body => {
            setApplication(body)
            setGithubLink(body.studentsubmission.link)
        })
    }

    //this will check if the fields are filled up
    function checkFields() {                
        var step = application.step
        // get the Current Date
        const currentDate = new Date();

        if (githubLink === "") {
            alert ("Please Enter Your Github Link");
        } else if (remark === "") {
            alert("Please enter remarks");
        } else {
            var remarks = {remark: remark, date: currentDate, commenter: userId, stepgiven: step}
            var studentsubmission = {link: githubLink, date: currentDate, step: step};
            
            resubmitApplication(remarks, studentsubmission)
        }
    }

    //this will be used to make changes!!
    async function resubmitApplication(remark, studentsubmission) {
        await fetch("http://localhost:3001/resubmit-application", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: id, remark: remark, studentsubmission: studentsubmission})
            }).then(response => response.json())
            .then(body => {
                if (body.success) {
                    alert("Successfully resubmitted!");
                }
                else {
                    alert("Failed to resubmit!");
                }
                navigate(-1);
            });
    }

    return (
        <>
        <div id='ApplicationMainContainer'>
            <div id="ApplicationDetails">
                <form onSubmit={stopReloadSubmit} id="AppDetailsForm">
                    <h1> Application Details </h1>
                    <p> Resubmit clearance application </p>
                    <br/>
                    <label for="gitHubLink"> GitHub Link </label>
                    <input type='text' id="gitHubLink" value={githubLink} onInput={e => setGithubLink(e.target.value)} required/>
                    <br/>
                    <label for="appRemarks"> Remarks </label>
                    <input type='text' id="appRemarks" onInput={e => setRemark(e.target.value)} required/>
                    <button onClick={() => checkFields()}> Request </button>
                </form>
            </div>

        </div>
        </>
    );
}