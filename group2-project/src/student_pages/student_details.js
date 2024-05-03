//this page will provide update about the progress of the user clearance application request

import { useParams , useNavigate, Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import { jsPDF } from 'jspdf';
const doc = new jsPDF();

export default function StudentDetails(){
    const navigate = useNavigate();

    let { id } = useParams();
    const [applicationinfo, setApplicationInfo] = useState({});
    const [clearance, setClearance] = useState({});
    const [step, setStep] = useState('');

    //using useEffect to ensure na no need to refresh  and this is the responsible for calling findinfos
    useEffect(() => {
        FindInfos();
      }, []);
    
    //this will fetch the getsubjectcode in the express and it will be utilized to get the 
    // other values or infos about that code since it will return all the inputs of the subject
    const FindInfos = async() => {
        await fetch(`http://localhost:3001/get-application-by-id?id=${id}`)     //code used in subjects will be utilized to find the whole data
        .then(response => response.json())
        .then(body => {
            setApplicationInfo(body);
            setStep(body.step);
        })
    }

    //this will get the specific clearance details
    const getClearance = async() => {
        await fetch("http://localhost:3001/get-clearance-details", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({_id: id})
        })
        .then(response => response.json())
        .then(body => {
            downloadPDF(body.studentName, body.studentNumber, body.adviserName, body.adminName);
        })
    }
    
    //this will just go back!
    const navigateBack = () => {
        navigate(-1);
    }

    //will be utilized for downloading!! 
      function downloadPDF(student_name, student_number, adviser_name, admin_name) {
        var verticalCenter = doc.internal.pageSize.height / 2;
        var horizontalCenter = doc.internal.pageSize.width / 2;
        var currDate = new Date().toDateString();
        doc.setFont('Times New Roman');
        doc.setFontSize(24)
        doc.text('University of the Philippines Los Baños', horizontalCenter, 20, {align: 'center'});
        doc.setFontSize(18);
        doc.text('College of Arts and Sciences', horizontalCenter, 30, {align: 'center'});
        doc.text('Institute of Computer Science', horizontalCenter, 40, {align: 'center'});
        doc.line(20, 50, doc.internal.pageSize.width - 20, 50);
        doc.setFontSize(14);
        doc.text(currDate, 20, 60)
        doc.text('This document certifies that ' + student_name + ', ' + student_number + ' has satisfied the clearance requirements of the institute.', 20, 80, {maxWidth: doc.internal.pageSize.width - 40})
        doc.setFontSize(14);
        doc.text('Verified: ', 20, 120);
        doc.text('Academic Adviser: ' + adviser_name, 20, 140, {maxWidth: doc.internal.pageSize.width - 40});
        doc.text('Clearance Officer: ' + admin_name, 20, 150, {maxWidth: doc.internal.pageSize.width - 40});
        doc.save("clearance.pdf");
    }
    
      return (
        <div class="bgbgbg">
            <div class="StudentContainer">
            <div id="StudentDetailsSection">
                <h1> Application Details </h1>

                <h2> Application ID: {applicationinfo._id} </h2>
                <h3>Link Submitted:</h3>
                <p>{applicationinfo.studentsubmission?.link}</p>
                <h3>Remarks:</h3>
                {applicationinfo.remarks &&
                applicationinfo.remarks.map((remark, i) => (
                    <div id="remarkscontent">
                    <h3 key={i}> Step {remark.stepgiven}: {remark.remark} </h3>
                    <p>Commenter: {remark.commenter} </p>
                    </div>
                ))}
                {step == 4 ? <>
                    <button onClick={() => getClearance()}>Download Clearance</button>
                <br /></> : <></>}
                <button onClick={navigateBack}>Back</button>
            </div>
            </div>
        </div>
    )

}