//This will be the screen for creating a clearance application details!

import {useState} from 'react';

import { useNavigate } from 'react-router-dom';

export default function StudentApplicationDetails() {
    //get userId
    const userId = localStorage.getItem("user");
    const navigate = useNavigate();

    //This function is created to stop reloading when submitting!
    //THIS PART IS COPIED FROM THE INTERNET TO STOP THE RELOADING (https://bobbyhadz.com/blog/react-prevent-page-refresh-on-form-submit#:~:text=Use%20the%20preventDefault()%20method,is%20to%20refresh%20the%20page.)
    const stopReloadSubmit = event => {
        event.preventDefault(); // prevent page refresh
    };

    // Get the Values from the Fields and Check if empty
    function FieldGetterChecker() {
        // Status set to Open and Step set to 1 since we're just opening a new Application for clearance
        var Status = "open" 
        var Step = 1
        
        // get the Current Date
        const currentDate = new Date();

        // var acadAdviser = document.getElementById("acadAdviser").value;
        var gitHubLink = document.getElementById("gitHubLink").value;
        var studentRemarks = document.getElementById("appRemarks").value;

        if (gitHubLink === "") {
            alert ("Please Enter Your Github Link");
        }else if(studentRemarks===""){
            alert("Please enter remarks");
        }else{
        var remarks = {remark: studentRemarks, date: currentDate, commenter: userId, stepgiven: 1}
        var studentsubmission = {link: gitHubLink, date: currentDate, step: Step};
        // call the addApplication to add the data to database
        addApplication(Status, Step, remarks, studentsubmission);
        }

    }

    // For pushing data to the database
    //DONT FORGET TO MAKE THESE THINGS ASYNC
    const addApplication = async(Status, Step, remarks, Studentsubmission) => {
        await fetch("http://localhost:3001/add-application", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // not yet complete (remakrs not yet implemented)
            //when adding, include userId so we know which user the entry belongs to
            body: JSON.stringify({status: Status, step: Step, remarks: remarks, studentsubmission: Studentsubmission, userId: userId})
        })
            .then(response => response.json())
            .then(body => {
                alert("Successfully Requested");
                navigate(-1);
            })           
    }

    return (
        <>
        <div class="container-details">
        <div id='ApplicationMainContainer'>
            <div id="ApplicationDetails">
                <form onSubmit={stopReloadSubmit} id="AppDetailsForm">
                    <h1> Application Details </h1>
                    <p> Request for a clearance </p>
                    {/* <label for="acadAdviser"> Academic Adviser </label> */}
                    {/* <input type='text' id="acadAdviser" required/> */}
                    <br/>
                    <label for="gitHubLink"> GitHub Link </label>
                    <input type='text' id="gitHubLink" required/>
                    <br/>
                    <label for="appRemarks"> Remarks </label>
                    <input type='text' id="appRemarks" required/>
                    <button onClick={() => FieldGetterChecker()}> Request </button>
                </form>
            </div>
        </div>
        </div>
        </>
    );
}