//This screen will be the main screen of the student and it will be the one 
// to first show when logged in

import {Link, useNavigate} from "react-router-dom";

import { useEffect, useState} from "react";

export default function StudentHome() {
    const userId = localStorage.getItem("user");
    const [userName, setUserName] = useState("");
    const [openApplication, setOpenApplication] = useState({});
    const [openFound, setOpenFound] = useState(false);
    
    //this will be used for onclick of buttons!
    const navigate = useNavigate();

    //this will go to the application details
    const navigateToAppDetails = () => {
        if(openApplication[0]!==undefined){
          alert("Creating more than 1 application is not allowed.");
        }else{
          navigate('/home/application-details');
        }
      };

    
    //this is for application history
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchUser();
        getAllApplications();
        if (openFound === false) {
          getSpecificApplication();
        }
    }, [openApplication]);


    //this function will be used to close the application of the user! 
    function closeApplication(){
      if (openApplication[0] != null) {
       var AppID = openApplication[0]._id;
       updateApplication(AppID);
      }
      else {
        alert("No open application!");
      }
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

    //this one will be used to close an application!
    async function updateApplication(id) {
      try {
          await fetch("http://localhost:3001/close-application", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({_id:id})
          })
          .then(response => response.json())
          .then(body => {
            if (body.success) {
              alert("Successfully closed!")
              setOpenApplication({})
            }
            else {
              alert("Failed to close!")
            }
          })
          // Additional code after the fetch request if needed
      } catch (error) {
          console.error('An error occurred:', error);
          // Handle the error appropriately
      }
  }

  //this will get all the applications made by the user
  async function getAllApplications(){
    try {
      await fetch("http://localhost:3001/get-user-applications", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({userId})
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

  //this will get the specific open applications
  async function getSpecificApplication(){
    // hanapin muna yung status na may open !!
    try{
        await fetch("http://localhost:3001/get-open-application", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({userId: userId})
        })
        .then(response => response.json())
        .then(body => {
            setOpenApplication(body);
            setOpenFound(true);
        })
    }catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
  }
  }

  if(openApplication[0] === undefined) {
    return (
      <div class="bgbgbg">        

      <div id= "MainContainer"> 
      <div id ="LeftSection">
          <card id ="ProfileCard">
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Profile"/>
              <h2>{userName}</h2>
              <p>Student</p>
          </card>
          
      </div>
      <div id="RightSection">
          <div id="UpperRightSection">
              <div id = "ClearanceInfo">
                  <div id="imageside">
                      <img src="https://www.freeiconspng.com/thumbs/list-icon/ingredients-list-icon--icon-search-engine-10.png" alt="list"/>
                  </div>
                  <div id="clearancecontent">
                      <h2>Clearance Status</h2>
                      <h3>No active application</h3>
                  </div>
              </div>
              
              <div id = "NumberInfo">
                  <div id="imageside">
                      <img src="https://icon-library.com/images/number_of_items_294001.png" alt="list"/>
                  </div>

                  <div id="numbercontent">
                      <h3>No. of</h3>
                      <h3>Application</h3>
                      <h2>{applications.length}</h2>
                  </div>
              </div>
              <div id="ButtonSection">
                <button id="Create" onClick={navigateToAppDetails}>
                    <h3>Create Clearance</h3>
                </button>
                <button id="Delete" onClick={closeApplication}>
                    <h3>Cancel Clearance</h3>
                </button>
              </div>
          </div>

          <div id ="ClearanceHistoryDiv">           
              <h1>Clearance History</h1>
              <div id="HistoryContent">
              <div id="HistoryHeaders">
                  <h4>Status</h4>
                  <h4>Step</h4>
                  <h4>Date</h4>
                  <h4>See Details</h4>
                </div>
                  {applications.map((application, i) =>
                    <card id ="ApplicationsCard">
                        <h2>{application.status}</h2>
                        <h4>{application.step}</h4>
                        <h4>{application.studentsubmission.date}</h4>
                        <Link to={`/home/${application._id}`}><button>View</button></Link>
                    </card>
                )}
              </div>
          </div>
      </div>
      </div>
      </div>
  );
  }
  else {
    return (
      <>        

      <div id= "MainContainer"> 
      <div id ="LeftSection">
          <card id ="ProfileCard">
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="User Profile"/>
              <h2>{userName}</h2>
              <p>Student</p>
          </card>
          
      </div>
      <div id="RightSection">
          <div id="UpperRightSection">
              <div id = "ClearanceInfo">
                  <div id="imageside">
                      <img src="https://www.freeiconspng.com/thumbs/list-icon/ingredients-list-icon--icon-search-engine-10.png" alt="list"/>
                  </div>
                  <div id="clearancecontent">
                      <h2>Clearance Status</h2>
                      <h3>{openApplication[0].status}</h3>
                      <p>{openApplication[0].remarks[0].date}</p>
                  </div>
              </div>
              
              <div id = "NumberInfo">
                  <div id="imageside">
                      <img src="https://icon-library.com/images/number_of_items_294001.png" alt="list"/>
                  </div>

                  <div id="numbercontent">
                      <h3>No. of</h3>
                      <h3>Application</h3>
                      <h2>{applications.length}</h2>
                  </div>
              </div>
              <div id="ButtonSection">
                <button id="Create" onClick={navigateToAppDetails}>
                    <h3>Create Clearance</h3>
                </button>
                <button id="Delete" onClick={closeApplication}>
                    <h3>Cancel Clearance</h3>
                </button>
                {openApplication[0].status == 'pending' ? 
                <Link to={`/home/resubmit-application/${openApplication[0]._id}`}><button className='editbtn'>Resubmit Clearance</button></Link> : <></>}
              </div>
          </div>

          <div id ="ClearanceHistoryDiv">           
              <h1>Clearance History</h1>
              <div id="HistoryContent">
                <div id="HistoryHeaders">
                  <h4>Status</h4>
                  <h4>Step</h4>
                  <h4>Date</h4>
                  <h4>See Details</h4>
                </div>
                  {applications.map((application, i) =>
                    <card id ="ApplicationsCard">
                        <h2>{application.status}</h2>
                        <h4>{application.step}</h4>
                        <h4>{application.studentsubmission.date}</h4>
                        <Link to={`/home/${application._id}`}><button>View</button></Link>
                    </card>
                )}
              </div>
          </div>
      </div>
      </div>
      </>
  );
  
}}
