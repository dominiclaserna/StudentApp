//This page will be the main home of the approver

import {useNavigate, Link} from "react-router-dom";
import { useEffect, useState,useRef} from "react";

export default function ApproverHome() {
  const userId = localStorage.getItem("user");
  const [userName, setUserName] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [sId, setSId] = useState("");
  const [step, setStep] = useState();
  const [status, setStatus] = useState("");
  const [students, setStudents] = useState([]);
  const [studentNames, setStudentNames] = useState(new Map());
  const [sortDate, setSortDate] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [hehe, setHehe] = useState(false);

  
  //this is for application history
  const [applications, setApplications] = useState([]);

  //this will be used for onclick of buttons!
  const navigate = useNavigate();

  useEffect(() => {
      fetchUser();
      getStudents();
      getAllApplications();
      getStudentNames();
  }, [hehe]);

  //this one will be used for searching
  const search = event => {
    event.preventDefault();
    getUserApplications();
  }

  //searching by step
  const searchStep = event => {
    event.preventDefault();
    getAllApplicationsByStep();
  }

  //searching by status
  const searchStatus = event => {
    event.preventDefault();
    getAllApplicationsByStatus();
  }

  //this will get the data from the user
  const fetchUser = async() => {
      await fetch("http://localhost:3001/get-user-by-id", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({_id: userId})
      })
        .then(response => response.json())
        .then(body => {
            setUserName(body.fname) //GET THE SHIT YOU NEED FROM THIS
          })
  }
  //this will get the student info
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

//this will get the student names
function getStudentNames() {
  if (students != null) {
      setStudentNames(students.reduce(function(map, obj) {
          map[obj._id] = obj.fname + " " + obj.mname + " " + obj.lname;
          return map;
      }, {}))
  }
}

//this will get all the applications made by all users
async function getAllApplications(){
  try {
    await fetch("http://localhost:3001/get-open-applications")
    .then(response => response.json())
    .then(body => {
        if (sortDate) {
          sortByDate(body)
        }
        if (sortName) {
          sortByName(body)
        }
        setApplications(body);
    })
    // Additional code after the fetch request if needed
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error appropriately
  }
}

//getting by step and sorting them!
async function getAllApplicationsByStep(){
  try {
    await fetch("http://localhost:3001/get-applications-step", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({step: step})
  })
    .then(response => response.json())
    .then(body => {
        if (sortDate) {
          sortByDate(body)
        }
        if (sortName) {
          sortByName(body)
        }
        setApplications(body);
    })
    // Additional code after the fetch request if needed
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error appropriately
  }
}

//getting the applications by status and sorting them
async function getAllApplicationsByStatus(){
  try {
    await fetch("http://localhost:3001/get-applications-status", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({status: status})
  })
    .then(response => response.json())
    .then(body => {
        if (sortDate) {
          sortByDate(body)
        }
        if (sortName) {
          sortByName(body)
        }
        setApplications(body);
    })
    // Additional code after the fetch request if needed
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error appropriately
  }
}

//sorting the date
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

//sorting the name
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
//get the applications made by the user
async function getUserApplications(){
  try {
    await fetch("http://localhost:3001/get-user-applications", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: sId})
    })
    .then(response => response.json())
    .then(body => {
        setApplications(body);
    })
    // Additional code after the fetch request if needed
} catch (error) {
    console.error('An error occurred:', error);
    // Handle the error appropriately
}
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
  setHehe(!hehe);
}

function setSortByDate() {
  setSortName(false);
  setSortDate(true);
  setHehe(!hehe);
}

  return (
    <>        
    <div id= "MainContainer"> 
    <div class='approv3r' id ="LeftSection">
        <card id ="ProfileCard">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Profile"/>
            <h2>{userName}</h2>
            <p>Approver</p>
        </card>
        
    </div>
    <div id="appRightSection">
        <div id="UpperRightApproverSection">
            
            <div class='appnumcontent' id = "NumberInfo">
                <div id="imageside">
                    <img src="https://icon-library.com/images/number_of_items_294001.png" alt="list"/>
                </div>

                <div id="numbercontent">
                    <h3>No. of Application</h3>
                    <h2>{applications.length}</h2>
                </div>
            </div>
            <div id="ButtonSection">
            </div>
        </div>
        <div id ="UnderClearance">
       
    
        </div>

        <div class='appclearancehist' id ="ClearanceHistoryDiv">
            <div id ="ClearanceHistoryDiv1">
              <h1>Clearance Application History</h1>
            </div>           
            
            <div id="HistoryContent">
            <form id='appform1' onSubmit={search}> 
              <input placeholder="Student ID" className="inputsapp" onInput={e => setSId(e.target.value)} />
              <button class='appsearchbtns' value="submit">Search</button>
              </form>
              <form id='appform2' onSubmit={searchStep}> 
              <input placeholder="Step" className="inputsapp" onInput={e => setStep(e.target.value)} />
              <button class='appsearchbtns' value="submit">Search by Step</button>
              </form>
              <form id='appform3' onSubmit={searchStatus}> 
              <input placeholder="Status" className="inputsapp" onInput={e => setStatus(e.target.value)} />
              <button class='appsearchbtns' value="submit">Search by Status</button>
              </form>
        <div id="approversort">
          <button class='appsortbtns' onClick={setAscending}>Ascending</button>
          <button class='appsortbtns' onClick={setDescending}>Descending</button>
          <button class='appsortbtns' onClick={setSortByDate}>Sort by Date</button>
          <button class='appsortbtns' onClick={setSortByName}>Sort by Name</button>
        </div>

        <div class='forspace'></div>
        <div id='appcontentcard'>
                {applications.map((application, i) =>
                  <card id ="ApplicationsCard">
                      <h2>{application.status}</h2>
                      <h4>{studentNames[application.userId] != null ? studentNames[application.userId] : application.userId}</h4>
                      <h4>{application.step}</h4>
                      <h4>{application.studentsubmission.date}</h4>
                      <h2 class='spaceh2'></h2>
                      <Link to={`/approver/details/${application._id}`}>View</Link>
                  </card>
              )}
            </div>
            </div>
        </div>
    </div>
    </div>
    </>
);

}
