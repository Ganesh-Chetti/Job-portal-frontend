import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import Footer from "../components/footer";

const Userlistedjobs = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://my-elegant-backend-api.onrender.com/jobs/getJobsByCategory?category=${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request
            },
          }
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response && err.response.status === 403) {
          setError("Unauthorized access. Please log in.");
        } else {
          setError("Unable to load data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAnchorEl(null);
    navigate("/Userlogin");
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/Userprofile");
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    console.log("job", job._id);
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/Userlogin");
        return;
      }

      const response = await axios.get(
        `https://my-elegant-backend-api.onrender.com/application/user-apply/${selectedJob._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    } catch (err) {
      console.error("Error applying for the job:", err);
      setApplySuccess(false);
    } finally {
      setSelectedJob(null);
    }
  };

  const handleCancel = () => {
    setSelectedJob(null);
  };

  return (
    <Box>
      {/* Navbar */}
      <AppBar
        position="sticky"
        color="primary"
        sx={{ background: "rgb(228, 45, 64)" }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              textAlign: "left",
              fontFamily: "Times New Roman",
            }}
          >
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

      {/* Page Content */}
      <Container sx={{ my: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          borderBottom="2px solid"
          fontWeight="bold"
          marginBottom="20px"
          // sx={{ animation: "colorChange 3s infinite" }}
        >
          {category} Jobs
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
          <Box textAlign="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        ) : data.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {data.map((item, dataIndex) =>
              item.jobs.map((job, jobIndex) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={5}
                  key={`${dataIndex}-${jobIndex}`}
                >
                  <Card
                    onClick={() => handleJobClick(job)}
                    sx={{
                      cursor: "pointer",
                      width: {
                        xs: "100%", // Full width on extra-small devices
                        sm: "90%", // 90% of container width on small devices
                        md: "385px", // Fixed width on medium and larger devices
                      },
                      height: {
                        xs: "auto", // Adjust height based on content on extra-small devices
                        md: "300px", // Fixed height on medium and larger devices
                      },
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                        backgroundColor: "#f3e9ff",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <Typography variant="h4" gutterBottom>
                        {
                          job.title
                            .toLowerCase() // Convert to lowercase
                            .replace(/\s+/g, " ") // Remove extra spaces
                            .trim() // Remove leading/trailing spaces
                            .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                        }
                      </Typography>
                      <Typography variant="h6">
                        {job.company.companyName}
                      </Typography>
                      <Typography gutterBottom>{job.location
                        .toLowerCase() // Convert to lowercase
                        .replace(/\s+/g, " ") // Remove extra spaces
                        .trim() // Remove leading/trailing spaces
                        .replace(/\b\w/g, (char) => char.toUpperCase()) }</Typography>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {job.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "5px",
                          marginTop: "auto",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            minWidth: "auto",
                          }}
                        >
                          {job.position} positions
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#bf130a",
                            borderColor: "#bf130a",
                            padding: "4px 8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            minWidth: "auto",
                          }}
                        >
                          {job.employementType}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#2f0b78",
                            borderColor: "#2f0b78",
                            padding: "4px 8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            minWidth: "auto",
                          }}
                        >
                          {job.salary}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <Typography variant="body1" textAlign="center">
            No data found for this category.
          </Typography>
        )}
      </Container>

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={Boolean(selectedJob)} onClose={handleCancel}>
          <DialogTitle>{selectedJob.category} Job Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Job Title:</strong> {selectedJob.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Description:</strong> {selectedJob.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Qualification:</strong> {selectedJob.qualification}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>KeySkills:</strong> {selectedJob.skills}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>EmploymentType:</strong> {selectedJob.employementType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>CompanyName:</strong> {selectedJob.company.companyName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>AboutCompany:</strong> {selectedJob.company.aboutCompany}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {selectedJob.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Salary:</strong> {selectedJob.salary}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Experience:</strong> {selectedJob.experienceLevel}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Position:</strong> {selectedJob.position}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApply}
              sx={{ backgroundColor: "GrayText", color: "#fff" }}
            >
              Apply
            </Button>
            <Snackbar
              open={applySuccess}
              autoHideDuration={3000} // Auto-hide after 3 seconds
              onClose={() => setApplySuccess(false)}
            >
              <Alert onClose={() => setApplySuccess(false)} severity="success">
                Job applied successfully!
              </Alert>
            </Snackbar>
            <Button onClick={handleCancel} variant="outlined" color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Success Alert */}
      {applySuccess && (
        <Snackbar
          open={applySuccess}
          autoHideDuration={3000} // Auto-hide after 3 seconds
          onClose={() => setApplySuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Change vertical to "middle" if supported for middle alignment
        >
          <Alert onClose={() => setApplySuccess(false)} severity="success">
            Job applied successfully!
          </Alert>
        </Snackbar>
      )}
      {/* <Footer /> */}
    </Box>
  );
};

export default Userlistedjobs;