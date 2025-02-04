import { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer";
import company from "../assets/company.png";
import HireHubImage from "../assets/HireHub.webp";

const CompanyDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
      const response = await axios.get(
        "https://job-portal-backend-black.vercel.app/jobs/getJobsByCompany",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

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
      const res = await axios.delete(
        `https://job-portal-backend-black.vercel.app/jobs/Job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")} `,
          },
        }
      );

      if (res.status === 200) {
        console.log(
          "Job deleted successfully:",
          res.data.message || "Job deleted."
        );

        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        setSelectedJob(null);
      } else {
        console.error(
          "Unexpected response while deleting job:",
          res.statusText
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Failed to delete job:", errorMessage);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen); // Toggle mobile menu state
  };
  const handleCardClick = async (jobId) => {
    console.log("Fetching job with ID:", jobId);

    try {
      const res = await axios.get(
        `https://job-portal-backend-black.vercel.app/jobs/getJob/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

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
          <Card
            sx={{
              padding: 2,
              borderRadius: 2,
              boxShadow: 6,
              background:
                "linear-gradient(to bottom right, rgb(231, 233, 237), rgb(101, 146, 166))",
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontFamily: "Times New Roman" }}
              >
                {selectedJob?.title || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Category:</strong> {selectedJob?.category || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Location:</strong> {selectedJob?.location || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Qualification:</strong>{" "}
                {selectedJob?.qualification || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Key Skills:</strong> {selectedJob?.skills || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Employment Type:</strong>{" "}
                {selectedJob?.employementType || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Salary:</strong> {selectedJob?.salary || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Positions:</strong> {selectedJob?.position || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Experience:</strong>{" "}
                {selectedJob?.experienceLevel || "N/A"}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
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
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: Avatar and HireHub text */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={HireHubImage}
              sx={{
                border: "0px solid white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "30%",
                width: isMobile ? 42 : 44,
                height: isMobile ? 42 : 44,
                marginRight: isMobile ? "8px" : "10px",
                transition: "0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontFamily: "Times New Roman",
                fontWeight: 600,
                flexGrow: 1,
                fontSize: isMobile ? "1.2rem" : "2rem",
              }}
            >
              HireHub
            </Typography>
          </Box>

          {/* Right side: Mobile Menu for smaller screens and Profile Avatar */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile ? (
              <>
                {/* Hamburger Icon for Mobile */}
                <IconButton color="inherit" onClick={toggleMobileMenu}>
                  <MenuIcon />
                </IconButton>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "60px",
                      right: 0,
                      backgroundColor: "black",
                      padding: "15px",
                      borderRadius: "5px",
                      boxShadow: 2,
                      zIndex: 10,
                      minWidth: "200px", // Added minimum width for the mobile menu
                      textAlign: "center", // Center text in the mobile menu
                    }}
                  >
                    <Button
                      color="inherit"
                      onClick={() => {
                        navigate("/applieduser");
                        setMobileMenuOpen(false);
                      }}
                      sx={{
                        fontFamily: "Times New Roman",
                        fontSize: "1rem",
                        marginBottom: "10px",
                        width: "100%", // Make button take up full width
                      }}
                    >
                      Applicants
                    </Button>
                    <Button>
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
                        <MenuItem onClick={handleProfileClick}>
                          Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                      </Menu>
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/applieduser")}
                  sx={{
                    fontFamily: "Times New Roman",
                    fontSize: "1rem",
                    marginRight: "10px",
                  }}
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
              </>
            )}
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
        <Box
          sx={{
            textAlign: "center",
            padding: { xs: "5px", md: "10px" }, // Adjusts padding based on screen size
          }}
        >
          {/* Responsive Company Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={company}
              alt="Company"
              style={{
                width: isMobile ? "80%" : "100%",
                maxWidth: "600px",
                borderRadius: "10px", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>

          {/* Company Dashboard Heading */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              marginTop: "20px",
              color: "#333",
              fontSize: { xs: "24px", md: "32px" },
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            Welcome to the Company Dashboard
          </Typography>
        </Box>

        {/* Job Cards or No Job Message */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // minHeight: "100vh",
            width: "100%",
            background: "linear-gradient(to right, #ff6f61, #de2d68, #9c27b0)",
            padding: 4,
          }}
        >
          {jobs.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Card
                    sx={{
                      background: "linear-gradient(to right, #1e3c72, #2a5298)",
                      color: "white",
                      borderRadius: 4,
                      boxShadow: 6,
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 10,
                        background:
                          "linear-gradient(to right, #3a6186, #89253e)",
                      },
                      padding: 2,
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
            <Typography
              variant="h5"
              color="white"
              textAlign="center"
              sx={{ fontWeight: "bold", mt: 5 }}
            >
              No jobs available.
            </Typography>
          )}
        </Box>
        {/* Add New Job Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 4,
            borderRadius: "20px",
            backgroundColor: "rgb(239, 47, 47)",
          }}
          onClick={() => navigate("/Addtojob")}
        >
          Add New Job
        </Button>
      </Container>

      {/* footer */}
      <Footer />
    </Box>
  );
};

export default CompanyDashboard;
