import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import SignIn from './general_pages/signin';
import SignUp from './general_pages/signup';
import AdminRoot from './admin_pages/admin_root';
import AdminHome from './admin_pages/admin_home';
import StudentApplicationDetails from './student_pages/student_application_details';
import AddApprover from './admin_pages/admin_add_approver';
import AdminApproverList from './admin_pages/admin_approvers';
import AssignApprover from './admin_pages/admin_assign_advisor';
import AdminApplicationDetails from './admin_pages/admin_application_details';
import ApproverDetails from './approver_pages/approver_details';
import AdminEditApprover from './admin_pages/admin_edit_approver';
import StudentRoot from './student_pages/student_root';
import ApproverRoot from './approver_pages/approver_root';
import StudentHome from './student_pages/student_home';
import ApproverHome from './approver_pages/approver_home';
import Resubmit from './student_pages/student_resubmit';
import StudentDetails from './student_pages/student_details';
import AdminClearance from './admin_pages/admin_manage_clearance';
import AdminDetails from './admin_pages/admin_details';

const checkIfLoggedInOnHome = async () => {

  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });

  const payload = await res.json();
  
    if (payload.isLoggedIn) {
      return redirect("/home")
    } else {
      return 0
    }
}

const checkIfLoggedInOnDash = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin",
    {
      method: "POST",
      credentials: "include" 
    });

  const payload = await res.json();
    if (payload.isLoggedIn) {
      return true
    } else {
      return redirect("/")
    }
}

const router = createBrowserRouter([
  {path: "/", element: <SignIn />, loader: checkIfLoggedInOnHome},
  {path: "/signup", element: <SignUp />},
   
  {path: "/home", element: <StudentRoot />, loader: checkIfLoggedInOnDash, children:[
    {path: "/home", element: <StudentHome />},
    {path: "/home/:id", element: <StudentDetails />},
    {path: "/home/application-details", element: <StudentApplicationDetails />},
    {path: "/home/resubmit-application/:id", element: <Resubmit />}
  ]},
  
  {path: "/admin", element: <AdminRoot />, loader: checkIfLoggedInOnDash, children:[
    {path: "/admin", element: <AdminHome />},
    {path: "/admin/:snum", element: <AdminApplicationDetails />},
    {path: "/admin/approver-list", element: <AdminApproverList />},
    {path: "/admin/add-approver", element: <AddApprover />},
    {path: "/admin/edit-approver/:id", element: <AdminEditApprover />},
    {path: "/admin/assign-approver", element: <AssignApprover />},
    {path: "/admin/manage-clearance", element: <AdminClearance />},
    {path: "/admin/clearance/:id", element: <AdminDetails />}
  ]},
  
  {path: "/approver", element: <ApproverRoot />, loader: checkIfLoggedInOnDash, children:[
    {path: "/approver", element: <ApproverHome />},
     {path: "/approver/details/:id", element: <ApproverDetails />},
  ]}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
