/* This screen will be used to manage the clearance of the users!
*/
import { useEffect, useState} from "react";

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
        
export default function AdminClearance() {
  const [isDescending, setIsDescending] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortStep, setSortStep] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentNames, setStudentNames] = useState(new Map());

  const [hehe, setHehe] = useState(false);
  
  //this is for application history
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getApplications();
    getStudents();
    getStudentNames();
  }, [hehe]);

      //this will get the applications made by the user!!
      async function getApplications(){
        await fetch("http://localhost:3001/get-open-applications")
          .then(response => response.json())
          .then(body => {
            if (sortDate) {
                sortByDate(body)
              }
              if (sortName) {
                sortByName(body)
              }
            if (sortStep) {
                sortByStep(body)
            }
              setApplications(body);
          })
      }

      //this will get the info of the students
      const getStudents = async() => {
        await fetch("http://localhost:3001/get-students", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(body => {
          setStudents(body);
        })
      }

      //geting the student names
      function getStudentNames() {
        if (students != null) {
            setStudentNames(students.reduce(function(map, obj) {
                map[obj._id] = obj.fname + " " + obj.mname + " " + obj.lname;
                return map;
            }, {}))
        }
      }

      //sorting by date
      function sortByDate(list) {
        list.sort((a,b) => {
          if (a.studentsubmission.date > b.studentsubmission.date) {
            return 1
          }
          
          if (a.studentsubmission.date < b.studentsubmission.date) {
            return -1
          }
      
          return 0
        });
        if (isDescending) {
          list.reverse();
        }
        setApplications(list);
      }

      //sorting by name
      function sortByName(list) {
        list.sort((a,b) => {
          if (studentNames[a.userId] > studentNames[b.userId]) {
            return 1
          }
          
          if (studentNames[a.userId] < studentNames[b.userId]) {
            return -1
          }
      
          return 0
        });
        if (isDescending) {
          list.reverse();
        }
        setApplications(list);
      }

      //sorting by step
      function sortByStep(list) {
        list.sort((a,b) => {
          if (a.step > b.step) {
            return 1
          }
          
          if (a.step < b.step) {
            return -1
          }
      
          return 0
        });
        if (isDescending) {
          list.reverse();
        }
        setApplications(list);
      }

    function setAscending() {
        setIsDescending(false);
        setHehe(!hehe);
      }
      
      function setDescending() {
        setIsDescending(true);
        setHehe(!hehe);
      }
      
      function setSortByName() {
        setSortName(true);
        setSortDate(false);
        setSortStep(false);
        setHehe(!hehe);
      }
      
      function setSortByDate() {
        setSortName(false);
        setSortDate(true);
        setSortStep(false);
        setHehe(!hehe);
      }

      function setSortByStep() {
        setSortName(false);
        setSortDate(false);
        setSortStep(true);
        setHehe(!hehe);
      }

    return(
      <>
      <div id="MainContainer">
        <div id ="LeftAdminSection">
          <card id="ProfileAdminCard">
              <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Unibersidad_ng_Pilipinas_Los_Banos.png" alt="User Profile"/>
              <h2>Admin</h2>
          </card>
        </div>

        <div id="RightSection">
          <div id="UpperRightSection">
            <div id="UserRequestInfo">
            
            <div id="imageside">
                      <img src="https://www.freeiconspng.com/thumbs/list-icon/ingredients-list-icon--icon-search-engine-10.png" alt="list"/>
            </div>
            
            <div id="userrequestcontent">
                      <h2>Pending Clearance Requests</h2>
                      <h3>{applications.length}</h3>
            </div>
            </div>

            <div id="UserApplicationsInfo">
            <div id="imageside">
                      <img src="https://www.freeiconspng.com/thumbs/list-icon/ingredients-list-icon--icon-search-engine-10.png" alt="list"/>
            </div>

            </div>
          </div>

                  <div id ="RequestListDiv">           
              <h1>Clearance Applications</h1>
            <button onClick={setAscending}>Ascending</button>
             <button onClick={setDescending}>Descending</button>
             <button onClick={setSortByDate}>Sort by Date</button>
              <button onClick={setSortByName}>Sort by Name</button>
              <button onClick={setSortByStep}>Sort by Step</button>
              <div id="RequestContent">
                  {applications.map((application, i) =>
                    <card id="ApplicationsCard">
                          <h2>{application.status} - {studentNames[application.userId] != null ? studentNames[application.userId] : application.userId} | {application.step} | {application.studentsubmission.date}</h2>
                          <Link to={`/admin/clearance/${application._id}`}>View</Link>
                    </card>
                  )}</div>
              </div>
          </div>  
        </div>
      </>
    );
}

