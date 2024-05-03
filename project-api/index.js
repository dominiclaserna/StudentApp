import express from 'express';
import cookieParser from 'cookie-parser';
import {addSuperUser} from './auth-controller.js';
// Initialize server
const app = express();

// Plugin for reading JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type,X-Requested-With,Cookie");
    res.setHeader("Access-Control-Allow-Credentials","true");
    next();
});
 
// Import router
import router from './router.js';
router(app);
app.post('/checkuser',addSuperUser);

// Server listens at Port 3001
app.listen(3001, () => { 
    console.log("API listening at port 3001."); 
    addSuperUser();
});
