import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  List,
  Card,
  CardContent,
  CircularProgress,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppliedJobsPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const authToken = localStorage.getItem("token");
        console.log(authToken)
        if (!authToken) {
            navigate("/Userlogin");
        }
        const response = await axios.get("https://my-elegant-backend-api.onrender.com/application/user-appliedJobs", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("Fetched applied jobs:", response.data.application[0].job);
        setJobs(response.data.application); 
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = () => {
    navigate("/Userprofile");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/Userlogin");
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="sticky" color="primary" sx={{background: "rgb(228, 45, 64)"}}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "left" ,fontFamily: "Times New Roman",}}>
            RealEstatePro
          </Typography>

          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ marginRight: 1 }}
          >
            <ArrowCircleLeftIcon fontSize="large" />
          </IconButton>

          <Button
            color="inherit"
            onClick={() => navigate("/listed-applied")}
            sx={{ marginRight: 2 }}
          >
            Listed U Applied
          </Button>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Content Section */}
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{animation: "colorChange 3s infinite",}}>
          Applied Jobs
        </Typography>
        <style>
          {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
              25% {color:rgb(237, 96, 80); /* Change to a different color (e.g., Tomato) */}
            50% {color:rgb(241, 145, 71); /* Change to a different color (e.g., Tomato) */}
            75% {color:rgb(125, 124, 123); /* Change to a different color (e.g., Tomato) */}
            100% {color:rgb(212, 55, 230);
          }
        `}
        </style>

        {loading ? (
          <CircularProgress />
        ) : jobs.length === 0 ? (
          <Typography variant="body1">No applied jobs found.</Typography>
        ) : (
          <List>
            {jobs.map((job,ind) => (
              <Card key={job.id} sx={{ marginBottom: 2,backgroundColor:"#fff4e6" }} >
                <CardContent>
                  <Typography variant="h4" style={{fontFamily: "Times New Roman",}}>{job.job?.title}</Typography>
                  <Typography variant="h6" color="secondary">
                    Company: {job.job?.company==null?"my company":job.job?.company.companyName}
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    Location: {job.job?.location}
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    Employment Type: {job.job?.employementType}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
};

export default AppliedJobsPage;