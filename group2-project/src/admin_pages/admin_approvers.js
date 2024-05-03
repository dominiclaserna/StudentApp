/*This screen be utilized to show the approvers via admin!
*/

import { useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function AdminApproverList() {
    const navigate = useNavigate();

    const [approvers, setApprovers] = useState([]);
    const [isDescending, setIsDescending] = useState(false);

    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");

    useEffect(() => {
        searchApprover();
    }, [isDescending, navigate]);

    const search = event => {
        event.preventDefault();
        searchApprover();
    };

    //this will search the approver!
    const searchApprover = async() => {
        await fetch("http://localhost:3001/search-approver", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fname: fname, mname: mname, lname: lname})
        })
        .then(response => response.json())
        .then(body => {
            body.sort((a,b) => {
                var temp1 = a.fname+a.mname+a.lname;
                var temp2 = b.fname+b.mname+b.lname;
                temp1.localeCompare(temp2)}
                );
            if (isDescending) {
                body.reverse();
            }
            setApprovers(body);
        })
    }

    //removing the approver!
    const deleteApprover = async(_id) => {
        await fetch("http://localhost:3001/delete-user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({_id: _id})
        })
        .then(response => response.json())
        .then(body => {
            console.log(body)
            searchApprover(); //xdd
        });
    }
    //this will go to assign approver
    const navigateToAssignAdviser = () => {
        navigate('/admin/assign-approver');
      }
    //this will go to add approver
    const navigateToAddApprover = () => {
        navigate('/admin/add-approver');
    }
    //this will go to manage clearance by the users
    const navigateToAdminClearance = () => {
        navigate('/admin/manage-clearance');
    }
    
    function setAscending() {
        setIsDescending(false);
    }

    function setDescending() {
        setIsDescending(true);
    }

    return (
        <div class="bgbgbg">
        <div id="MainContainer">
        <div id ="LeftAdminSection">
          <card id="ProfileAdminCard">
              <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Unibersidad_ng_Pilipinas_Los_Banos.png" alt="User Profile"/>
              <h2>Admin</h2>
              <button className="adminbtnadv" onClick={navigateToAssignAdviser}>Assign Adviser to Students</button>
              <button className="adminbtnapp" onClick={navigateToAdminClearance}>View Users Pending Applications</button>
          </card>
        </div>

        <div id="RightSection">
        <button class='addappbtn' onClick={navigateToAddApprover}>Add new approver</button>
        <form class='formsearch' onSubmit={search}> 
            <input placeholder="First Name" className="searchbtns" onInput={e => setFname(e.target.value)} />
            <input placeholder="Middle Name" className="searchbtns" onInput={e => setMname(e.target.value)} />
            <input placeholder="Last Name" className="searchbtns" onInput={e => setLname(e.target.value)} />
            <button class='searchsubmit' value="submit">Search</button>
        </form>
        <div class="ascdescbtn">
            <button class='asc' onClick={setAscending}>Ascending</button> /
            <button class='desc' onClick={setDescending}>Descending</button>
        </div>
        <div className='bgapprover'>
            {approvers.map((approver) =>
                <card id="approver-card">
                    <div className='approverlist'>
                        <p className='appname'>{approver.fname} {approver.mname} {approver.lname}</p>
                        <div class='appemp'>
                        <p className='appnum'>Employee Number: {approver.snumber}</p>
                        <p className='appemail'>Email: {approver.email}</p>
                        </div>
                        <Link to={`/admin/edit-approver/${approver._id}`}><button className='editbtn'>Edit</button></Link>
                        <button className='delbtn' onClick={() => deleteApprover(approver._id)}>Delete</button>
                    </div>
                </card>
            )}
            <br />
            <tr />
        </div>
        </div>
        </div>
        <br /><br />
        <tr />
        </div>
    )
}