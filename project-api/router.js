import { getUsers, addUser, deleteUser, getUserById, getApprovers, getApproverByName, getStudents, assignAdviser, updateApprover } from './user-controller.js';
import { getApplications, getOpenApplications, addApplication, deleteApplication, getApplicationByID, getOpenApplication, getUserApplications, closeApplication, approveApplication, returnApplication, resubmitApplication, getAllApplicationsByStep, clearApplication, getAllApplicationsByStatus, getClearanceDetails } from './application-controller.js';

import { getUserRequests,getUserBySNum, addUserRequest, deleteUserRequest } from './account-controller.js';
import { signUp, login, checkIfLoggedIn } from './auth-controller.js';


export default function router(app) {

  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);

  app.get("/get-users", getUsers);
  app.post("/add-user", addUser);
  app.post("/delete-user", deleteUser);
  app.post("/get-user-by-id", getUserById);
  app.get("/get-approvers", getApprovers);
  app.post("/search-approver", getApproverByName);
  app.post("/get-students", getStudents);
  app.post("/assign-adviser", assignAdviser);
  app.post("/update-approver", updateApprover);

  app.get("/get-applications", getApplications);
  app.get("/get-open-applications",getOpenApplications);
  app.get("/get-application-by-id",getApplicationByID);
  app.post("/add-application", addApplication);
  app.post("/delete-application", deleteApplication);
  app.post("/get-open-application", getOpenApplication);
  app.post("/get-user-applications", getUserApplications);
  app.post("/close-application", closeApplication);
  app.post("/approve-application", approveApplication);
  app.post("/return-application", returnApplication);
  app.post("/resubmit-application", resubmitApplication);
  app.post("/get-applications-step", getAllApplicationsByStep);
  app.post("/get-applications-status", getAllApplicationsByStatus);
  app.post("/clear-application", clearApplication);
  app.post("/get-clearance-details", getClearanceDetails)

  app.get("/get-requests", getUserRequests);
  app.get("/get-user-request-by-snum", getUserBySNum);
  app.post("/add-request", addUserRequest);
  app.post("/delete-request", deleteUserRequest);
}
