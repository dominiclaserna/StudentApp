/* This will be the home page of the admin and it will 
the first one to show when logged in
*/
import { useEffect, useState} from "react";

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
        
export default function AdminHome() {
  const [userRequests, setUserRequests] = useState([]);
  const [isDescending, setIsDescending] = useState(false);
  const [sortSNumber, setSortSNumber] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [hehe, setHehe] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    getUserRequests();
  }, [hehe]);

         function getUserRequests () {
        fetch("http://localhost:3001/get-requests")
        .then(response => response.json())
        .then(body => {
          if (sortSNumber) {
            sortBySNumber(body);
          }
          if (sortName) {
            sortByName(body);
          }
          setUserRequests(body);
        })
        
      }

      //the following will be used to navigate to different pages
      
       const navigateToApproverList = () => {
        navigate('/admin/approver-list');
      }

      const navigateToAdminClearance = () => {
        navigate('/admin/manage-clearance');
      }

      const navigateToAssignAdviser = () => {
        navigate('/admin/assign-approver');
      }

      //sorting by student number
      function sortBySNumber(list) {
        list.sort((a,b) => {
          if (a.snumber > b.snumber) {
            return 1
          }
          
          if (a.snumber < b.snumber) {
            return -1
          }
      
          return 0
        });
        if (isDescending) {
          list.reverse();
        }
        setUserRequests(list);
      }
      
      //sorting by name
      function sortByName(list) {
        list.sort((a,b) => {
          var temp1 = a.fname+a.mname+a.lname;
          var temp2 = b.fname+a.mname+a.lname;
          return temp1.localeCompare(temp2);
        });
        if (isDescending) {
          list.reverse();
        }
        setUserRequests(list);
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
        setSortSNumber(false);
        setHehe(!hehe);
      }
      
      function setSortBySNumber() {
        setSortName(false);
        setSortSNumber(true);
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
          <button className="adminbtnadv" onClick={navigateToAssignAdviser}>Assign Adviser to Students</button>
          <button className="adminbtnapp" onClick={navigateToAdminClearance}>View Users Pending Applications</button>
        </div>

        <div id="RightSection">
          <div id="UpperRightSection">
            <div id="UserRequestInfo">
            
            <div id="imageside">
                      <img src="https://www.freeiconspng.com/thumbs/list-icon/ingredients-list-icon--icon-search-engine-10.png" alt="list"/>
            </div>
            
            <div id="userrequestcontent">
                      <h2>Pending User Requests</h2>
                      <h3>{userRequests.length}</h3>
            </div>
            </div>

          </div>

                  <div id ="RequestListDiv">           
              <h1>Account Requests</h1>
            <button onClick={setAscending}>Ascending</button>
             <button onClick={setDescending}>Descending</button> - 
              <button id='sortbtn' onClick={setSortBySNumber}>Sort by Student Number</button>
              <button onClick={setSortByName}>Sort by Name</button>
              <div id="RequestContent">
                  {userRequests.map((userRequest, i) =>
                    <card>
                          <h2>{userRequest.fname} {userRequest.mname} {userRequest.lname} ({userRequest.snumber})</h2>
                          <Link to={`/admin/${userRequest.snumber}`}>View</Link>

                    </card>
                  )}</div>
              </div>
          </div>  
        </div>
      </>
    );
}

