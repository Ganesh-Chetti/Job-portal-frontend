import React from "react";
import Landingpage from "./components/landingpage";
import CompanyDashboard from "./Company/Companydashboard";
import UserRegistrationForm from "./User/UserRegistration";
import UserLoginPage from "./User/Userlogin";
import { BrowserRouter, Route,Routes } from "react-router-dom";
import CompanyloginPage from "./Company/Companylogin";
import CompanyRegistrationPage from "./Company/Companyregistration";
import Userdashboard from "./User/Userdashboard";
import Userlistedjobs from "./User/Userlistedjobs";
import AppliedJobsPage from "./User/Appliedjobs";
import AppliedUser from "./Company/Userappliedlist";
import CompanyProfile from "./Company/Companyprofile";
import AddtoJob from "./Company/addtojob";
import Userprofile from "./User/Userprofile"
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/*" element={<Landingpage/>}/>
        <Route path="/Companylogin" element={<CompanyloginPage />} />
        <Route path="/Companyregistration" element={<CompanyRegistrationPage />} />
        <Route path="/Companydashboard" element={<CompanyDashboard />} />
        <Route path="/Companyprofile" element={<CompanyProfile />}/>
        <Route path="Addtojob" element={<AddtoJob />} />
        <Route path="/applieduser" element={<AppliedUser />} />
        <Route path="/Userlogin" element={<UserLoginPage />} />
        <Route path="/Userregistration" element={<UserRegistrationForm />}/>
        <Route path="/Userdashboard" element={<Userdashboard />}/>
        <Route path="/Userprofile" element={<Userprofile />}/>
        <Route path="/listed-applied" element={<AppliedJobsPage />} />
        <Route path="/getJobsByCategory/:category" element={<Userlistedjobs />} />

    </Routes>
    </BrowserRouter>
    
  );
};

export default App;