import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Container,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  IconButton ,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/footer";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const AppliedUser = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const navigate = useNavigate(); // Hook for navigation

   useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/Companylogin");
      return; 
    }
  
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://my-elegant-backend-api.onrender.com/application/getApplicationByCompany",
          {
            headers: { Authorization:`Bearer ${token}` },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, [navigate]); 
  

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
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
  

  return (
    <Box>
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
            background: "rgb(228, 45, 64)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <HomeIcon 
      fontSize="large" 
      sx={{ cursor: "pointer" }}
      />
      <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "Times New Roman", }} component="div">
      RealEstatePro
      </Typography>
    </Box>
    {/* {Avthar} */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
            onClick={()=>navigate(-1)} 
            color="inherit">
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                cursor: "pointer",
              }}
              alt="User Avatar"
              onClick={handleAvatarClick}
            >
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
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
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? 2 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold" margin="15px"
        >
          Users Applied for the Job
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
        <Grid container spacing={3}>
          {users.length > 0 ? (
            users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  sx={{
                    background: "#a5cf5d",
                    borderRadius: "16px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "#0d47a1" }}
                    >
                      {user.applicant.fullname}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <strong>Email:</strong> {user.applicant.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                      <strong>Phone:</strong> {user.applicant.mobilenumber}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", color: "#1a237e" }}
                    >
                      <strong>Job Title:</strong> {user.job.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ textAlign: "center", marginTop: 4 }}
            >
              No users have applied yet.
            </Typography>
          )}
        </Grid>
      </Container>

      {/* Footer */}
    <Footer/>
    </Box>
  );
};

export default AppliedUser;