/* This will be used to assign adviser to the student!
*/

import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function AssignApprover() {
    const navigate = useNavigate();

    const [approvers, setApprovers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState();
    const [selectedStudent, setSelectedStudent] = useState();
    const [isDescending, setIsDescending] = useState(false);
    const [approverNames, setApproverNames] = useState(new Map());

    useEffect(() => {
        get();
        getApproverNames();
    }, [isDescending]);

    const get = event => {
        getApprovers();
        getStudents();
    };

    //this will get the approvers data and sort them!
    const getApprovers = async() => {
        await fetch("http://localhost:3001/get-approvers")
        .then(response => response.json())
        .then(body => {
            body.sort((a,b) => {
                var temp1 = a.fname+a.mname+a.lname;
                var temp2 = b.fname+b.mname+b.lname;
                if (temp1 < temp2) {
                    return -1;
                }
                if (temp1 > temp2) {
                    return 1;
                }
                return 0
            });
            if (isDescending) {
                body.reverse();
            }
            setApprovers(body);
        })
    }

    //this will get the students/users data and sort them
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
            body.sort((a,b) => {
                var temp1 = a.fname+a.mname+a.lname;
                var temp2 = b.fname+b.mname+b.lname;
                if (temp1 < temp2) {
                    return -1;
                }
                if (temp1 > temp2) {
                    return 1;
                }
                return 0
            });
            if (isDescending) {
                body.reverse();
            }
            setStudents(body);
        })
    }

    //this will be responsible to assign specific adviser to student
    const assignAdviser = async(adviser_id, student_id) => {
        await fetch("http://localhost:3001/assign-adviser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({adviser: adviser_id, student: student_id})
        })
            .then(response => response.json())
            .then(body => {
                if (body.success == true) {
                    alert("Success!");
                }
                else {
                    alert("Failed!");
                }
            })
            getStudents();
    }

    //this will get the approvers name
    function getApproverNames() {
        if (approvers != null) {
            setApproverNames(approvers.reduce(function(map, obj) {
                map[obj._id] = obj.fname + " " + obj.mname + " " + obj.lname;
                return map;
            }, {}))
        }
    }
    
    //the following will be utilized for sorting!

    function selectApprover(approver) {
        setSelectedApprover(approver)
    }

    function selectStudent(student) {
        setSelectedStudent(student)
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
                <div id="LeftAdminSection">
                    <div id ="LeftAdminSection">
                        <card id="ProfileAdminCard">
                            <img src="https://upload.wikimedia.org/wikipedia/en/1/12/Unibersidad_ng_Pilipinas_Los_Banos.png" alt="User Profile"/>
                            <h2>Admin</h2>
                        </card>
                    </div>

                </div>
                <div id="RightSection">
                    <div id='ApproversAndStudents'>
                    <button  onClick={setAscending}>Ascending</button>
                    <button  onClick={setDescending}>Descending</button>
                    <div id='StudentApproverSelected'>
                        {selectedApprover == null ? (<p>No approver selected.</p>)
                        :(<p>Approver selected: {selectedApprover.fname} {selectedApprover.mname} {selectedApprover.lname} </p>)}
            
                        {selectedStudent == null ? (<p>No student selected.</p>)
                        :(<p>Student selected: {selectedStudent.fname} {selectedStudent.mname} {selectedStudent.lname} </p>)}
            
                        {(selectedApprover != null && selectedStudent != null) ? (<button onClick={() => assignAdviser(selectedApprover._id, selectedStudent._id)}>Assign adviser</button>) : null}
                        {}
                    </div>
                    <div id='ApproversStudentsListSection'>
                        <h3>APPROVERS:</h3>
                        <div id='ApproversStudentsDetails'>
                            {approvers.map((approver) =>
                                <card>
                                    <h4>{approver.fname} {approver.mname} {approver.lname} | {approver.snumber} | {approver.email}</h4>
                                    <button onClick={() => {selectApprover(approver)}}>Select</button>
                                </card>
                            )}
                        </div>
                        
                    </div>
                    <div id='ApproversStudentsListSection'>
                        <h3>STUDENTS:</h3>
                        <div id='ApproversStudentsDetails'>
                            {students.map((student) =>
                                <card>
                                    <h4>
                                        {student.fname} {student.mname} {student.lname} | 
                                        {student.snumber} | 
                                        {student.email} | 
                                        Adviser: {approverNames[student.adviser] != null ? approverNames[student.adviser] : student.adviser == null ? 'No adviser yet' : student.adviser}
                                    </h4>
                                    <button onClick={() => {selectStudent(student)}}> Select</button>
                                </card>
                            )}
                        </div>
                        
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}