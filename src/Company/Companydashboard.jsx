
import  { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer";
import company from "../assets/company.png"

const CompanyDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/Companylogin");
    } else {
      fetchJobs();
    }
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://my-elegant-backend-api.onrender.com/jobs/getJobsByCompany", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
  
      if (response.status === 200) {
        setJobs(response.data.data);
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        if (error.response.status === 403) {
          console.error("Forbidden. Likely token issue or permissions.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };
  
  

  const deleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`https://my-elegant-backend-api.onrender.com/jobs/Job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")} `},
      });
  
      if (res.status === 200) {
        console.log("Job deleted successfully:", res.data.message || "Job deleted.");
  
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        setSelectedJob(null); 
      } else {
        console.error("Unexpected response while deleting job:", res.statusText);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Failed to delete job:", errorMessage);
    }
  };
  
  

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/Companyprofile");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    navigate("/Companylogin");
    handleMenuClose();
  };

  const handleCardClick = async (jobId) => {
    console.log("Fetching job with ID:", jobId);
  
    try {
      const res = await axios.get(`https://my-elegant-backend-api.onrender.com/jobs/getJob/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
  
      if (res.status === 200) {
        console.log("Job fetched successfully:", res.data.job);
        setSelectedJob(res.data.job); 
      } else {
        console.error("Failed to fetch job details:", res.statusText);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Failed to get job:", errorMessage);
    }
  };
  
  

  if (selectedJob) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Job Details
          </Typography>
          <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 6,background:"linear-gradient(to bottom right, rgb(231, 233, 237), rgb(101, 146, 166))" }} >
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{fontFamily: "Times New Roman"}}>
                {selectedJob?.title || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Category:</strong> {selectedJob?.category || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Location:</strong> {selectedJob?.location || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Qualification:</strong> {selectedJob?.qualification || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Key Skills:</strong> {selectedJob?.skills || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Employment Type:</strong> {selectedJob?.employementType || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Salary:</strong> {selectedJob?.salary || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Positions:</strong> {selectedJob?.position || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Experience:</strong> {selectedJob?.experienceLevel || "N/A"}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    fontWeight: "bold",
                    boxShadow: 3,
                    "&:hover": { backgroundColor: "#d32f2f" },
                  }}
                  onClick={() => deleteJob(selectedJob?._id)}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    boxShadow: 3,
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => setSelectedJob(null)}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "rgb(228, 45, 64)"}}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", }}>
          <Typography variant="h4" component="div" sx={{fontFamily:"Times New Roman",}}>
            RealEstatePro
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={() => navigate("/applieduser")}
            sx={{ fontFamily:"Times New Roman",fontSize:"1rem",marginRight:"10px"}}
          >
            Applicants
          </Button>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                cursor: "pointer",
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
              }}
              alt="Company Avatar"
              onClick={handleAvatarClick}
            >
              <Avatar src="/broken-image.jpg" />
            </Avatar>

            {/* Menu for Avatar */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          padding: 4,
        }}
      >
        <Box>
          <img src={company}/>
        </Box>
        <Typography variant="h4"
        fontWeight="bold"
        margin="15px"
         >
          Welcome to the Company Dashboard
        </Typography>
        <style>
        {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
            50% {color:rgb(255, 151, 71); /* Change to a different color (e.g., Tomato) */}
            100% {color:rgb(212, 55, 230);
          }
        `}
      </style>

        {/* Job Cards or No Job Message */}
        {jobs.length > 0 ? (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card
                  sx={{
                    backgroundColor:"#a5cf5d",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleCardClick(job._id)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Category:</strong> {job.category}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {job.location}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Salary:</strong> ${job.salary.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No jobs available.</Typography>
        )}
        {/* Add New Job Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 4 ,borderRadius:"20px",backgroundColor:"rgb(239, 47, 47)"}}
          onClick={() => navigate("/Addtojob")}
        >
          Add New Job
        </Button>
      </Container>

      {/* footer */}
      <Footer/>
    </Box>
  );
};

export default CompanyDashboard;