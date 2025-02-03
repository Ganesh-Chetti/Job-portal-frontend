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
  Avatar,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, ArrowCircleLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HireHubImage from "../assets/HireHub.webp";

const AppliedJobsPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          navigate("/Userlogin");
          return;
        }
        const response = await axios.get(
          "https://job-portal-backend-black.vercel.app/application/user-appliedJobs",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setJobs(response.data.application);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [navigate]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => {
    navigate("/Userprofile");
    handleMenuClose();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/Userlogin");
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side - Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={HireHubImage} sx={{ width: 50, height: 50, marginRight: 2 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: "Times New Roman", fontWeight: 600 }}
            >
              HireHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            <IconButton color="inherit" onClick={() => navigate(-1)} sx={{ marginRight: 1 }}>
              <ArrowCircleLeft fontSize="large" />
            </IconButton>

            <Button color="inherit" onClick={() => navigate("/listed-applied")} sx={{ marginRight: 2 }}>
              Listed U Applied
            </Button>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle fontSize="large" />
            </IconButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            color="inherit"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 250, paddingTop: "20px" }}>
          <List>
            <ListItem button onClick={() => navigate(-1)}>
              <ArrowCircleLeft sx={{ marginRight: 1 }} />
              <ListItemText primary="Go Back" />
            </ListItem>
            <ListItem button onClick={() => navigate("/listed-applied")}>
              <ListItemText primary="Listed U Applied" />
            </ListItem>
            <ListItem button onClick={handleProfile}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Account Menu (Dropdown) */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Content Section */}
      <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: { xs: 2, md: 4 },
    textAlign: "center",
  }}
>
  {/* Animated Title */}
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      fontWeight: "bold",
      animation: "colorChange 3s infinite",
      fontSize: { xs: "1.8rem", md: "2.5rem" },
    }}
  >
    Applied Jobs
  </Typography>

  {/* Color Changing Animation */}
  <style>
    {`
      @keyframes colorChange {
        0% { color: rgb(71, 221, 255); }
        25% { color: rgb(237, 96, 80); }
        50% { color: rgb(241, 145, 71); }
        75% { color: rgb(125, 124, 123); }
        100% { color: rgb(212, 55, 230); }
      }
    `}
  </style>

  {/* Show Loader if Fetching Data */}
  {loading ? (
    <CircularProgress size={60} />
  ) : jobs.length === 0 ? (
    <Typography variant="body1" sx={{ fontSize: "1.2rem", color: "gray" }}>
      No applied jobs found.
    </Typography>
  ) : (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 3,
        maxWidth: "1200px",
        width: "100%",
      }}
    >
      {jobs.map((job, ind) => (
        <Card
          key={ind}
          sx={{
            background: "#C8E6C9",
            color: "black",
            boxShadow: 3,
            borderRadius: 3,
            padding: 2,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 5,
              background: "#81C784",
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, fontFamily: "Times New Roman", textTransform: "capitalize" }}
            >
              {job.job?.title}
            </Typography>
            <Typography variant="body1" sx={{ color: "black", fontWeight: "bold" }}>
              Company: {job.job?.company?.companyName || "My Company"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#333" }}>
              Location: {job.job?.location}
            </Typography>
            <Typography variant="body2" sx={{ color: "#333" }}>
              Employment Type: {job.job?.employementType}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )}
</Box>

    </div>
  );
};

export default AppliedJobsPage;
